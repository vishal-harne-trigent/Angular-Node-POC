import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import User, { UserCreationAttributes } from "./user.model";
import { USER_ATTRIBUTES } from "../../common/constants/constants";
import { UserInput, UserStatus } from "./user.types";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User
    ) {}

    async findAll() {
        return await this.userModel.findAll({
            attributes: [...USER_ATTRIBUTES],
            order: [["id", "ASC"]],
        });
    }

    async findById(id: number) {
        return await this.userModel.findByPk(id, {
            attributes: [...USER_ATTRIBUTES],
        });
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ where: { email } });
    }

    async create(userData: UserCreationAttributes) {
        const user = await this.userModel.create(userData);
        return await this.findById(user.id);
    }

    async updateById(id: number, userData: UserInput) {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            return null;
        }

        await user.update(userData);
        return await this.findById(id);
    }

    async updateStatusById(id: number, status: UserStatus) {
        return await this.updateById(id, { status });
    }

    async deleteById(id: number) {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            return null;
        }

        await user.destroy();
        return true;
    }
}
