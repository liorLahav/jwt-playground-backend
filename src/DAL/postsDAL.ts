import { postsCollection } from "../mongoDB/connectToDB";

export interface Post {
  title: string;
  content: string;
  userName: string;
}

export const addPost = async ({ title, content, userName }: Post, userId: string) =>
  await postsCollection.insertOne({
    title,
    content,
    userId,
    userName,
    createdAt: new Date(),
  });

export const getAllPosts = async () => await postsCollection.find().toArray();
