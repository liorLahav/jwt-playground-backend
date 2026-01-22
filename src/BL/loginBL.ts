import { FastifyReply, FastifyRequest } from "fastify";
import { findUser } from "../DAL/loginDAL";
import { StatusCodes } from "http-status-codes";

interface LoginRequestBody  {
    userName: string;
    password: string;
}

export const loginHandler = async (request: FastifyRequest<{Body: LoginRequestBody}>, reply: FastifyReply) => {
    const {userName, password} = request.body as {userName: string, password: string};
    const user = await findUser(userName, password);

    if (!user) {
        return reply.status(StatusCodes.UNAUTHORIZED).send({ error: "Invalid credentials" });
    }

    const token = await reply.jwtSign({ userId: user._id, userName: user.userName });
    



    return reply.status(StatusCodes.OK).send({ message: "Login successful", user });
}