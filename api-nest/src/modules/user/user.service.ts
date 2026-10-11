import { Injectable } from "@nestjs/common";
import { AppError } from "../../common/errors/app.error";
import { UserRepository } from "./user.repository";
import { UserCreationAttributes } from "./user.model";
import { UpdateUserStatusInput, UserInput } from "./user.types";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw AppError.notFound("User not found");
        }

        return user;
    }

    async createUser(userData: UserInput) {
        return await this.userRepository.create(userData as UserCreationAttributes);
    }

    async updateUser(id: number, userData: UserInput) {
        const updatedUser = await this.userRepository.updateById(id, userData);

        if (!updatedUser) {
            throw AppError.notFound("User not found");
        }

        return updatedUser;
    }

    async patchUser(id: number, userData: UserInput) {
        const updatedUser = await this.userRepository.updateById(id, userData);

        if (!updatedUser) {
            throw AppError.notFound("User not found");
        }

        return updatedUser;
    }

    async updateUserStatus(id: number, { status }: UpdateUserStatusInput) {
        const updatedUser = await this.userRepository.updateStatusById(id, status);

        if (!updatedUser) {
            throw AppError.notFound("User not found");
        }

        return updatedUser;
    }

    async deleteUser(id: number) {
        const deleted = await this.userRepository.deleteById(id);

        if (!deleted) {
            throw AppError.notFound("User not found");
        }
    }
}
