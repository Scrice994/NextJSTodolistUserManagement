import mongoose from "mongoose";
import UserModel from "../../src/models/mongo/userSchema";
import bcrypt from "bcrypt";
import { UserEntity } from "src/models/UserEntity";
import { VerificationTokenEntity } from "src/models/VerificationTokenEntity";
import crypto from "crypto";
import verificationTokenModel from "../../src/models/mongo/verificationTokenSchema";

export const databaseConnection = async () => {
  mongoose.set('strictQuery', false);
  return mongoose.connect('mongodb://127.0.0.1:27017/TodoList');
};

export const clearDB = async () => {
  await mongoose.connection.dropDatabase();
};

const testUser = {
  username: "testUsername",
  email: "testEmail@gmail.com",
  tenantId: "testTenantId",
  userRole: "Admin",
  status: "Pending"
};

export const findOneEntityFromDb = async (model: mongoose.Model<any>, filter: any) => {
  const findEntity = await model.findOne(filter);
  const { _id, __v, createdAt, updatedAt, ...result } = findEntity.toObject();
  return result;
};

const initializeEntity = async (model: mongoose.Model<any>, entityBody: Partial<UserEntity> | Partial<VerificationTokenEntity>) => {
  const createEntity = await model.create(entityBody);
  const { _id, __v, ...result } = createEntity.toObject();
  return result;
};

export const initializeActiveAccount = async () => {
  const passwordRaw = "testPassword";
  const passwordHashed = await bcrypt.hash(passwordRaw, 10); 

  const initializedUser = await initializeEntity(UserModel, {...testUser, status: "Active", password: passwordHashed});
  return initializedUser;
};

export const initializePendingAccount = async () => {
  const passwordRaw = "testPassword";
  const passwordHashed = await bcrypt.hash(passwordRaw, 10);

  const initializedUser = await initializeEntity(UserModel, {...testUser, password: passwordHashed });

  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const verificationCodeHashed = await bcrypt.hash(verificationCode, 10);

  const initializeToken = await initializeEntity(verificationTokenModel, { userId: initializedUser.id, verificationCode: verificationCodeHashed });

  return {
    user: initializedUser,
    verificationCode,
    token: initializeToken
  };
};

export const initializeMemberAccount = async () => {
  const passwordRaw = "testPassword";
  const passwordHashed = await bcrypt.hash(passwordRaw, 10);

  const initializedUser = await initializeEntity(UserModel, {...testUser, password: passwordHashed, status: "Active", userRole: "Member" });

  return initializedUser;
};

export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
};
