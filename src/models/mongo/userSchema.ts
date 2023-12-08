import { InferSchemaType, Schema, model } from "mongoose";
import * as uuid from 'uuid';

const userSchema = new Schema({
    id: { default: uuid.v4, type: String, unique: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, select: false },
    password: { type: String, select: false },
    userRole: { type: String, require: true, enum: ["Admin", "Member"] },
    status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
    tenantId: { type: String },
    googleId: { type: String, unique: true, sparse: true, select: false },
}, { timestamps: true });

userSchema.pre("validate", function (next) {
    if(!this.password && !this.googleId){
        return next(new Error("User must have a password or social provider id"));
    }
    if(!this.username && !this.googleId){
        return next(new Error("User must have a username or social provider id"));
    }
    next();
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);