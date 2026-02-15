import { FastifyInstance, FastifyRequest } from "fastify";
import { adminPanelHandler, getAllUsersHandler, userPanelHandler } from "../BL/panelBL";
import { authorization } from "../middleware/authorization";

export const panelRoutes = (server: FastifyInstance) => {
  server.get("/admin", {preHandler: [authorization(["admin"])]}, adminPanelHandler);
  server.get("/getAllSecured", {preHandler: [authorization(["admin"])]}, getAllUsersHandler);
  server.get("/getAllUnsecured", getAllUsersHandler);
  server.get("/user", {preHandler: [authorization()]}, userPanelHandler);
};
