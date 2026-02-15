import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";
import { getAllUsers } from "../DAL/adminPanelDAL";

export const adminPanelHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as User;

  return reply
    .status(StatusCodes.OK)
    .send({ message: `Welcome to the admin panel, ${user.userName}!` });
};

export const userPanelHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as User;

  return reply
    .status(StatusCodes.OK)
    .send({ message: `Welcome to the user panel, ${user.userName}!` });
};

export const getAllUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const users = await getAllUsers();
  return reply.status(StatusCodes.OK).send(users);
};
