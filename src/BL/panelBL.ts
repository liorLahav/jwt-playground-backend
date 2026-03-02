import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { deleteUserById, getAllUsers, getNumOfUsers } from "../DAL/adminPanelDAL";

export const getNumOfUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const users = await getNumOfUsers();
  return reply.status(StatusCodes.OK).send(users);
};

export const getAllUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const users = await getAllUsers();
  return reply.status(StatusCodes.OK).send(users);
}

export const deleteUserHander = async (
  request: FastifyRequest<{Params: {id: string}}>,
  reply: FastifyReply,
) => {
  const id = request.params.id;
  const success = await deleteUserById(id);
  if (success) {
    return reply.status(StatusCodes.OK).send({ message: "User deleted successfully" });
  } else {
    return reply.status(StatusCodes.NOT_FOUND).send({ error: "User not found" });
  }
}
