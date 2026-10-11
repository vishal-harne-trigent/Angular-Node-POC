import "reflect-metadata";
import dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { RequestMethod } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "./app.module";
import logger from "./common/logger/logger";
import logError from "./common/logger/log-error.util";

dotenv.config();

const PORT = 3003;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: true });

    app.setGlobalPrefix("api", {
        exclude: [{ path: "/", method: RequestMethod.GET }],
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle("API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig));

    const sequelize = app.get(Sequelize);

    try {
        await sequelize.authenticate();

        logger.info("Database connection successful.");

        await sequelize.sync({ alter: true });

        logger.info("Database synchronized.");

        await app.listen(PORT);

        logger.info(`Server is running on port ${PORT}`);
        logger.info(`Swagger docs at http://localhost:${PORT}/api/docs`);
    } catch (error) {
        logError(
            "Unable to start application",
            { message: error instanceof Error ? error.message : "Unknown error" },
            error instanceof Error ? error : undefined
        );
    }
}

bootstrap();
