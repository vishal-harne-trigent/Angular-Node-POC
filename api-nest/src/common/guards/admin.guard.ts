import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AppError } from "../errors/app.error";
import logError from "../logger/log-error.util";
import { UserRepository } from "../../modules/user/user.repository";
import { AuthRequest } from "./jwt-auth.guard";
import { loadAuthProfile } from "./load-auth-profile.util";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly userRepository: UserRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<AuthRequest>();

        const logContext = {
            method: req.method,
            url: req.originalUrl,
        };

        try {
            const user = await loadAuthProfile(req, this.userRepository);

            if (user.role !== "admin") {
                throw AppError.forbidden("Admin access required");
            }

            return true;
        } catch (error) {
            if (error instanceof AppError) {
                logError("Admin authorization failed", {
                    ...logContext,
                    statusCode: error.statusCode,
                    message: error.message,
                });

                throw error;
            }

            logError(
                "Admin authorization failed",
                {
                    ...logContext,
                    statusCode: 500,
                    message: error instanceof Error ? error.message : "Unknown error",
                },
                error instanceof Error ? error : undefined
            );

            throw new AppError(500, "Internal server error");
        }
    }
}
