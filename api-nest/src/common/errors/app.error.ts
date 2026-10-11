export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "AppError";
        Error.captureStackTrace(this, AppError);
    }

    private static create(statusCode: number, message: string, factory: Function) {
        const error = new AppError(statusCode, message);
        Error.captureStackTrace(error, factory);
        return error;
    }

    static badRequest(message: string) {
        return AppError.create(400, message, AppError.badRequest);
    }

    static unauthorized(message = "Unauthorized") {
        return AppError.create(401, message, AppError.unauthorized);
    }

    static forbidden(message = "Forbidden") {
        return AppError.create(403, message, AppError.forbidden);
    }

    static notFound(message = "Not found") {
        return AppError.create(404, message, AppError.notFound);
    }

    static conflict(message: string) {
        return AppError.create(409, message, AppError.conflict);
    }

    static internal(message = "Internal server error") {
        return AppError.create(500, message, AppError.internal);
    }
}
