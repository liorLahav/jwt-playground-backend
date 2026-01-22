import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginHandler } from "../BL/loginBL";

export const authRouts = (server: FastifyInstance) => {
    server.post('/login', loginHandler)
} 