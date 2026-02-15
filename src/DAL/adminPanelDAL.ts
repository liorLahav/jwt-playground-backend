import { usersCollection } from "../mongoDB/connectToDB";

export const getAllUsers = async () => await usersCollection.countDocuments();
