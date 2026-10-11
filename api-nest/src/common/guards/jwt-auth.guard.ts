import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error";
import logError from "../logger/log-error.util";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
    authProfile?: {
        id: number;
        role: string;
    };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<AuthRequest>();

        const logContext = {
            method: req.method,
            url: req.originalUrl,
        };

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logError("Unauthorized", {
                ...logContext,
                statusCode: 401,
                message: "Missing or invalid authorization header",
            });

            throw new AppError(401, "Unauthorized");
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            logError("JWT secret is not configured", {
                ...logContext,
                statusCode: 500,
            });

            throw new AppError(500, "JWT secret is not configured");
        }

        try {
            const decoded = jwt.verify(token, jwtSecret) as {
                id: number;
                email: string;
            };

            req.user = decoded;
            return true;
        } catch (error) {
            logError(
                "Invalid or expired token",
                {
                    ...logContext,
                    statusCode: 401,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Token verification failed",
                },
                error instanceof Error ? error : undefined
            );

            throw new AppError(401, "Invalid or expired token");
        }
    }
}
