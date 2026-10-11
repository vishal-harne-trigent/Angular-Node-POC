export type UserStatus = "active" | "inactive";

export const USER_STATUSES: UserStatus[] = ["active", "inactive"];

export type UserRole = "employee" | "admin";

export const USER_ROLES: UserRole[] = ["employee", "admin"];

export interface UserInput {
    name?: string;
    email?: string;
    phoneNumber?: string;
    status?: UserStatus;
    role?: UserRole;
}

export interface UpdateUserStatusInput {
    status: UserStatus;
}
