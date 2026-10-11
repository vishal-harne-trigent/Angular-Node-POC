import { Controller, Get, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from "express";

@ApiExcludeController()
@Controller()
export class AppController {
    @Get()
    getRoot(@Res() res: Response) {
        res.send("Node JS API is running");
    }
}
