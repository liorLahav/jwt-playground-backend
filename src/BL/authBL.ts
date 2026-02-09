import { FastifyReply, FastifyRequest } from "fastify";
import { findUser } from "../DAL/authDAL";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";

/**
 * httponly - if true cookie not accessible via JS (mitigates XSS)
 * secure - if true cookie only sent over HTTPS (mitigates MITM attacks)
 * path - URL path cookie valid for (/ means entire site)
 * sameSite:
 *  none - cookie sent with all requests from any site (CSRF risk, requires secure) (secure should be true)
 *  lax - cookie sent with top-level navigations and GET requests from other sites (some CSRF risk)
 *  strict - cookie only sent with requests from same site (no CSRF risk)
 */

interface LoginRequestBody {
  userName: string;
  password: string;
  storedLocation: "cookies" | "localStorage" | "httponly";
  alg: null | "HS256";
  exp: true | false;
  sameSite: "none" | "lax" | "strict";
  secure: true | false;
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
    alg,
    exp,
    sameSite,
    httpOnly,
    secure,
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
    console.log("hey");
    reply.setCookie("token", token, {
      httpOnly: httpOnly,
      secure: secure,
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
  return reply.status(StatusCodes.OK).send({ user });
};
