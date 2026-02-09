import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { GetUserHandler, loginHandler, logoutHandler } from "../BL/authBL";
import { authorization } from "../middleware/authorization";

export const authRouts = (server: FastifyInstance) => {
    server.post('/login', loginHandler);
    server.get('/getUser', {preHandler: [authorization()]}, GetUserHandler);
    server.post('/logout', logoutHandler)
} 