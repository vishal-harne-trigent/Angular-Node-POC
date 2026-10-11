import "reflect-metadata";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { dbConfig } from "../src/config/db.config";
import User from "../src/modules/user/user.model";

dotenv.config();

const ADMIN = {
    email: "admin@trigent.com",
    password: "password123",
    name: "Admin",
    role: "admin" as const,
    status: "active" as const,
};

const sequelize = dbConfig.password
    ? new Sequelize({
          database: dbConfig.name,
          username: dbConfig.user,
          password: dbConfig.password,
          host: dbConfig.host,
          port: dbConfig.port,
          dialect: dbConfig.dialect,
          logging: false,
          models: [User],
      })
    : new Sequelize(
          `postgresql://${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
          {
              dialect: dbConfig.dialect,
              logging: false,
              models: [User],
          }
      );

async function seedAdmin() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const hashedPassword = await bcrypt.hash(ADMIN.password, 10);
    const existing = await User.findOne({ where: { email: ADMIN.email } });

    if (existing) {
        await existing.update({
            name: ADMIN.name,
            password: hashedPassword,
            role: ADMIN.role,
            status: ADMIN.status,
        });
        console.log(`Updated admin user id=${existing.id} email=${ADMIN.email}`);
    } else {
        const created = await User.create({
            name: ADMIN.name,
            email: ADMIN.email,
            password: hashedPassword,
            role: ADMIN.role,
            status: ADMIN.status,
        });
        console.log(`Created admin user id=${created.id} email=${ADMIN.email}`);
    }

    await sequelize.close();
}

seedAdmin().catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exit(1);
});
