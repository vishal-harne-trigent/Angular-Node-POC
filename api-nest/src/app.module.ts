import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { dbConfig } from "./config/db.config";
import { AppController } from "./app.controller";
import { LoggerModule } from "./common/logger/logger.module";
import { AllExceptionsFilter } from "./common/filters/exceptions.filter";
import { RequestLoggerMiddleware } from "./common/middleware/request-logger.middleware";
import User from "./modules/user/user.model";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

const sequelizeOptions: SequelizeModuleOptions = dbConfig.password
    ? {
          dialect: "postgres",
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          logging: false,
          models: [User],
      }
    : {
          dialect: "postgres",
          uri: `postgresql://${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
          logging: false,
          models: [User],
      };

@Module({
    imports: [
        LoggerModule,
        SequelizeModule.forRootAsync({
            useFactory: () => sequelizeOptions,
        }),
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes("*");
    }
}
