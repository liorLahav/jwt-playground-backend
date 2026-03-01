import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";

export const badAuthorization = () => {
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
          .send({ error: "Unauthorized" } );
      }

      request.headers.authorization = `Bearer ${token}`;
      const payload = (await request.jwtVerify()) as User;

      request.user = payload

    } catch (err) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Unauthorized" });
    }
  };
};
