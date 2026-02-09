import { FastifyReply, FastifyRequest } from "fastify";
import { addPost, getAllPosts, Post } from "../DAL/postsDAL";
import { StatusCodes } from "http-status-codes";

export const addPostHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id, userName } = request.user as { id: string; userName: string };
  const { title, content } = request.body as Post;

  await addPost({ title, content, userName }, id);
};

export const getAllPostsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const posts = await getAllPosts();
  return reply.status(StatusCodes.OK).send(posts);
};
