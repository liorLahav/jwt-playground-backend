import { ObjectId } from "mongodb";
import { usersCollection } from "../mongoDB/connectToDB";

export const getNumOfUsers = async () => await usersCollection.countDocuments();

export const getAllUsers = async () => await usersCollection.find().toArray();

export const deleteUserById = async (id: string) => {
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};
