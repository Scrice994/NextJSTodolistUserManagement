import { IEntity } from "./IEntity";

export interface UserEntity extends IEntity {
    username: string,
    email?: string,
    password?: string,
    userRole: string,
    status?: string,
    tenantId?: string,
    googleId?: string,
    githubId?: string,
    createdAt?: string,
    updatedAt?: string
}