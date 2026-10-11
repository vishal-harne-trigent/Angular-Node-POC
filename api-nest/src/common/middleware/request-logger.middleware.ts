import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import logger from "../logger/logger";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - start;

            logger.info(`${req.method} ${req.originalUrl}`, {
                statusCode: res.statusCode,
                duration: `${duration}ms`,
            });
        });

        next();
    }
}
