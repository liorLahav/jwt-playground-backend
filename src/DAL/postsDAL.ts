import { postsCollection } from "../mongoDB/connectToDB";

export interface Post {
  title: string;
  content: string;
}

export const addPost = async ({ title, content }: Post, userId: string) =>
  await postsCollection.insertOne({
    title,
    content,
    userId,
    createdAt: new Date(),
  });

export const getAllPosts = async () => await postsCollection.find().toArray();
