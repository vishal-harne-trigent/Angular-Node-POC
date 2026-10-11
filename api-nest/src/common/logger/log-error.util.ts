import logger from "./logger";

const captureSourceTrace = (error?: Error): string =>
    error?.stack || (new Error().stack ?? "").split("\n").slice(3).join("\n").trim();

export const logError = (message: string, meta: Record<string, unknown>, error?: Error) => {
    logger.error(message, { ...meta, sourceTrace: captureSourceTrace(error) });
};

export default logError;
