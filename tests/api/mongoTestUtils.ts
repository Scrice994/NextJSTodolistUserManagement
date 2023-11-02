import mongoose from "mongoose";

export const databaseConnection = async () => {
  mongoose.set('strictQuery', false);
  return mongoose.connect('mongodb://127.0.0.1:27017/TodoList');
};

export const clearDB = async () => {
  await mongoose.connection.dropDatabase();
};


export const initializeData = async (array: any[], model: mongoose.Model<any>) => {
  await model.insertMany(array);
};

export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
};
