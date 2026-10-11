import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodApiBody } from "../../common/swagger/zod-api-body";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { LoginInput, RegisterInput } from "./auth.types";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ZodApiBody(registerSchema)
    @HttpCode(201)
    async register(
        @Body(new ZodValidationPipe(registerSchema, "body")) body: RegisterInput
    ) {
        const { name, email, password, phoneNumber, role } = body;

        return await this.authService.register({
            name,
            email,
            password,
            phoneNumber,
            role,
        });
    }

    @Post("login")
    @ZodApiBody(loginSchema)
    @HttpCode(200)
    async login(@Body(new ZodValidationPipe(loginSchema, "body")) body: LoginInput) {
        const { email, password } = body;

        return await this.authService.login({ email, password });
    }
}
