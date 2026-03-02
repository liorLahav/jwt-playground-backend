import { ObjectId } from "mongodb";
import { usersCollection } from "../mongoDB/connectToDB";
import { User } from "../types/User";

export const findUser = async (
  userName: string,
  password: string,
): Promise<User | null> =>
  await usersCollection.findOne<User>({ userName, password });

export const findUserById = async (id: string): Promise<User | null> =>
  await usersCollection.findOne<User>({ _id: new ObjectId(id) });
