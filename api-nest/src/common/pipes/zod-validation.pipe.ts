import { PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";
import { AppError } from "../errors/app.error";
import logError from "../logger/log-error.util";

type ValidationTarget = "body" | "params";

export class ZodValidationPipe implements PipeTransform {
    constructor(
        private readonly schema: ZodType,
        private readonly target: ValidationTarget
    ) {}

    transform(value: unknown) {
        const result = this.schema.safeParse(value ?? {});
        if (result.success) return result.data;

        const errors = result.error.flatten().fieldErrors as Record<string, string[]>;
        logError("Validation failed", { target: this.target, statusCode: 400, errors });
        throw new ValidationError(errors);
    }
}

export class ValidationError extends AppError {
    constructor(public errors: Record<string, string[]>) {
        super(400, "Validation failed");
        this.name = "ValidationError";
    }
}
