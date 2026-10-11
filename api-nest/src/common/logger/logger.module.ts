import { Global, Module } from "@nestjs/common";
import logger from "./logger";

export const WINSTON_LOGGER = "WINSTON_LOGGER";

@Global()
@Module({
    providers: [
        {
            provide: WINSTON_LOGGER,
            useValue: logger,
        },
    ],
    exports: [WINSTON_LOGGER],
})
export class LoggerModule {}
