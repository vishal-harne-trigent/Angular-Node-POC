import dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
    name: process.env.DB_NAME || "node_learning",
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    password: process.env.DB_PASSWORD,
    dialect: "postgres" as const,
};
