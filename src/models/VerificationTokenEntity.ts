import { IEntity } from "./IEntity";

export interface VerificationTokenEntity extends IEntity {
    userId: string,
    verificationCode: string
}