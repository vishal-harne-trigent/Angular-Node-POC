import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/errors/app.error";
import { UserRepository } from "../user/user.repository";
import { UserCreationAttributes } from "../user/user.model";
import { LoginInput, RegisterInput } from "./auth.types";

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async register({ name, email, password, phoneNumber, role }: RegisterInput) {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw AppError.conflict("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
        } as UserCreationAttributes);

        return user;
    }

    async login({ email, password }: LoginInput) {
        const user = await this.userRepository.findByEmail(email);

        if (!user || !user.password) {
            throw AppError.unauthorized("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw AppError.unauthorized("Invalid email or password");
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw AppError.internal("JWT secret is not configured");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
            expiresIn: "1d",
        });

        const safeUser = await this.userRepository.findById(user.id);

        return { token, user: safeUser };
    }
}
