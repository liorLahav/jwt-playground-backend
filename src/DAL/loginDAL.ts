import { usersCollection } from "../mongoDB/connectToDB"
import { User } from "../types/User";

export const findUser = async (userName: string, password: string): Promise<User | null> => 
    await usersCollection.findOne<User>({userName, password});
