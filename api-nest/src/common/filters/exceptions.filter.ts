import {ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AppError } from "../errors/app.error";
import logError from "../logger/log-error.util";
import { ValidationError } from "../pipes/zod-validation.pipe";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const { method, originalUrl: url } = ctx.getRequest<Request>();

        if (exception instanceof ValidationError) {
            const { statusCode, message, errors } = exception;
            return res.status(statusCode).json({ message, errors });
        }

        if (exception instanceof AppError) {
            const { statusCode, message } = exception;
            logError("Application error", { method, url, statusCode, message }, exception);
            return res.status(statusCode).json({ message });
        }

        if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            const message =
                exception instanceof NotFoundException
                    ? "Route not found"
                    : this.getHttpExceptionMessage(exception);
            logError("HTTP exception", { method, url, statusCode, message }, exception);
            return res.status(statusCode).json({ message });
        }

        const error = exception instanceof Error ? exception : undefined;
        const message = error?.message ?? "Unknown error";
        logError("Unhandled error", { method, url, statusCode: 500, message }, error);
        return res.status(500).json({ message: "Internal server error" });
    }

    private getHttpExceptionMessage(exception: HttpException): string | string[] {
        const response = exception.getResponse();
        if (typeof response === "string") return response;

        if (
            typeof response === "object" &&
            response !== null &&
            "message" in response &&
            (typeof response.message === "string" ||
                (Array.isArray(response.message) &&
                    response.message.every((message) => typeof message === "string")))
        ) {
            return response.message;
        }

        return exception.message;
    }
}
