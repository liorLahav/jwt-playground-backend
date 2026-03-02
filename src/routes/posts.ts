import { FastifyInstance } from "fastify";
import { authorization } from "../middleware/authorization";
import { addPostHandler, getAllPostsHandler } from "../BL/postsBL";

export const postsRoutes = (server: FastifyInstance) => {
  server.post("/add", { preHandler: [authorization()] }, addPostHandler);
  server.get("/getAll", { preHandler: [authorization()] }, getAllPostsHandler);
};
