import { UserRole } from "../user/user.types";

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: UserRole;
}

export interface LoginInput {
    email: string;
    password: string;
}
