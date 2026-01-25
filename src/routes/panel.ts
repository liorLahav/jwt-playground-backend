import { FastifyInstance, FastifyRequest } from "fastify";
import { adminPanelHandler, userPanelHandler } from "../BL/panelBL";
import { authorization } from "../middleware/authorization";

export const panelRoutes = (server: FastifyInstance) => {
  server.get("/admin", {preHandler: [authorization(["admin"])]}, adminPanelHandler);
  server.get("/user", {preHandler: [authorization()]}, userPanelHandler);
};
