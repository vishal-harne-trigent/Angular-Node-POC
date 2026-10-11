import { AppError } from "../errors/app.error";
import { UserRepository } from "../../modules/user/user.repository";
import { AuthRequest } from "./jwt-auth.guard";

export const loadAuthProfile = async (
    req: AuthRequest,
    userRepository: UserRepository
) => {
    const authUser = req.user;

    if (!authUser?.id) {
        throw AppError.unauthorized("Authentication required");
    }

    const user = await userRepository.findById(authUser.id);

    if (!user) {
        throw AppError.unauthorized("User not found");
    }

    req.authProfile = {
        id: user.id,
        role: user.role,
    };

    return user;
};
