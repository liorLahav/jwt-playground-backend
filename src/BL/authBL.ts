import { FastifyReply, FastifyRequest } from "fastify";
import { findUser } from "../DAL/authDAL";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";
import { getKidVulnEnabled, setKidVulnEnabled } from "./kidBL";
import { getBacVulnEnabled, setBacVulnEnabled } from "./bacBL";

interface LoginRequestBody {
  userName: string;
  password: string;
  storedLocation: "cookies" | "localStorage";
  sameSite: "none" | "lax" | "strict";
  httpOnly: true | false;
}

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply,
) => {
  const {
    userName,
    password,
    storedLocation,
    sameSite,
    httpOnly,
  } = request.body;
  const user = await findUser(userName, password);

  if (!user) {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ error: "Invalid credentials" });
  }

  const token = await reply.jwtSign({
    id: user._id,
    userName: user.userName,
    role: user.role,
  });

  console.log(token);

  if (storedLocation === "localStorage") {
    return reply
      .status(StatusCodes.OK)
      .send({ message: "Login successful", token, user });
  }

  if (storedLocation === "cookies") {
    reply.setCookie("token", token, {
      httpOnly: httpOnly,
      secure: true,
      path: "/",
      sameSite: sameSite,
      maxAge: 60 * 60 * 24,
    });

    return reply
      .status(StatusCodes.OK)
      .send({ message: "Login successful", user });
  }
};

export const logoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log("Logging out user:", request.user);
  reply.clearCookie("token", {
    path: "/",
  });
  return reply
    .status(StatusCodes.OK)
    .send({ message: "Logged out successfully" });
};

export const GetUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as User;
  console.log("GetUserHandler user:", request.user);
  return reply.status(StatusCodes.OK).send(user);
};

export const getKidVulnHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  return reply.status(StatusCodes.OK).send({ enabled: getKidVulnEnabled() });
};

export const toggleKidVulnHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  setKidVulnEnabled(!getKidVulnEnabled());
  return reply.status(StatusCodes.OK).send({ enabled: getKidVulnEnabled() });
};

export const getBacVulnHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  return reply.status(StatusCodes.OK).send({ enabled: getBacVulnEnabled() });
};

export const toggleBacVulnHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  setBacVulnEnabled(!getBacVulnEnabled());
  return reply.status(StatusCodes.OK).send({ enabled: getBacVulnEnabled() });
};
