import { InferSchemaType, Schema, model } from "mongoose";
import * as uuid from "uuid";

const verificationTokenSchema = new Schema({
    id: { default: uuid.v4, type: String, unique: true },
    userId: { type: String, require: true, unique: true },
    verificationCode: { type: String, require: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: "10m" }
});

type VerificationToken = InferSchemaType<typeof verificationTokenSchema>;

export default model<VerificationToken>("verificationToken", verificationTokenSchema);