import {Body,Controller,Delete, Get, HttpCode, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ZodApiBody } from "../../common/swagger/zod-api-body";
import { AdminGuard } from "../../common/guards/admin.guard";
import { AuthRequest, JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { SelfOrAdminGuard } from "../../common/guards/self-or-admin.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { UserService } from "./user.service";
import { UserInput } from "./user.types";
import { createUserSchema, idParamSchema, patchUserSchema, updateUserSchema, updateUserStatusSchema} from "./user.schema";

const isAdminRequest = (req: AuthRequest) => req.authProfile?.role === "admin";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(200)
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Get(":id")
    @ApiParam({ name: "id", type: Number })
    @HttpCode(200)
    @UseGuards(SelfOrAdminGuard)
    async getUserById(
        @Param(new ZodValidationPipe(idParamSchema, "params")) params: { id: number }
    ) {
        return await this.userService.getUserById(params.id);
    }

    @Post()
    @ZodApiBody(createUserSchema)
    @HttpCode(201)
    @UseGuards(AdminGuard)
    async createUser(
        @Body(new ZodValidationPipe(createUserSchema, "body")) body: UserInput
    ) {
        const { name, email, phoneNumber, status, role } = body;
        return await this.userService.createUser({
            name,
            email,
            phoneNumber,
            status,
            role,
        });
    }

    @Put(":id")
    @ApiParam({ name: "id", type: Number })
    @ZodApiBody(updateUserSchema)
    @HttpCode(200)
    @UseGuards(SelfOrAdminGuard)
    async updateUser(
        @Req() req: AuthRequest,
        @Param(new ZodValidationPipe(idParamSchema, "params")) params: { id: number },
        @Body(new ZodValidationPipe(updateUserSchema, "body")) body: UserInput
    ) {
        const { name, email, phoneNumber, status, role } = body;

        const userData: UserInput = isAdminRequest(req)
            ? { name, email, phoneNumber, status, role }
            : { name, email, phoneNumber };

        return await this.userService.updateUser(params.id, userData);
    }

    @Patch(":id/status")
    @ApiParam({ name: "id", type: Number })
    @ZodApiBody(updateUserStatusSchema)
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async updateUserStatus(
        @Param(new ZodValidationPipe(idParamSchema, "params")) params: { id: number },
        @Body(new ZodValidationPipe(updateUserStatusSchema, "body"))
        body: { status: UserInput["status"] }
    ) {
        const { status } = body;
        return await this.userService.updateUserStatus(params.id, {
            status: status!,
        });
    }

    @Patch(":id")
    @ApiParam({ name: "id", type: Number })
    @ZodApiBody(patchUserSchema)
    @HttpCode(200)
    @UseGuards(SelfOrAdminGuard)
    async patchUser(
        @Req() req: AuthRequest,
        @Param(new ZodValidationPipe(idParamSchema, "params")) params: { id: number },
        @Body(new ZodValidationPipe(patchUserSchema, "body")) body: UserInput
    ) {
        const userData: UserInput = isAdminRequest(req)
            ? body
            : {
                  ...(body.name !== undefined ? { name: body.name } : {}),
                  ...(body.email !== undefined ? { email: body.email } : {}),
                  ...(body.phoneNumber !== undefined
                      ? { phoneNumber: body.phoneNumber }
                      : {}),
              };

        return await this.userService.patchUser(params.id, userData);
    }

    @Delete(":id")
    @ApiParam({ name: "id", type: Number })
    @HttpCode(200)
    @UseGuards(AdminGuard)
    async deleteUser(
        @Param(new ZodValidationPipe(idParamSchema, "params")) params: { id: number }
    ) {
        await this.userService.deleteUser(params.id);
        return {
            message: "User deleted successfully",
        };
    }
}
