import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";

export const authorization = (allowedRoles: string[] = []) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let token = request.cookies?.token;

      if (!token && request.headers["authorization"]) {
        const authHeader = request.headers["authorization"] as string;
        if (authHeader.startsWith("Bearer ")) token = authHeader.slice(7);
      }

      if (!token) {
        return reply
          .status(StatusCodes.UNAUTHORIZED)
          .send({ error: "Unauthorized" });
      }

      request.headers.authorization = `Bearer ${token}`;
      const payload = (await request.jwtVerify()) as User;
      console.log(payload);

      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        return reply.status(StatusCodes.FORBIDDEN).send({ error: "Forbidden" });
      }

      request.user = payload

    } catch (err) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Unauthorized" });
    }
  };
};
