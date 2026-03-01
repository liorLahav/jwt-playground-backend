import { FastifyInstance, FastifyRequest } from "fastify";
import { deleteUserHander, getAllUsersHandler, getNumOfUsersHandler } from "../BL/panelBL";
import { authorization } from "../middleware/authorization";
import { badAuthorization } from "../middleware/badAuthorization";

export const panelRoutes = (server: FastifyInstance) => {
  server.get("/getTotalUsers", {preHandler: [authorization(["admin"])]}, getNumOfUsersHandler);
  server.get("/getAll", {preHandler: [authorization(["admin"])]}, getAllUsersHandler);
  server.delete<{Params: {id: string}}>("/deleteUser/:id", {preHandler: [authorization(["admin"])]}, deleteUserHander);
  server.get("/getAllUnsecured", {preHandler: badAuthorization()}, getAllUsersHandler);
  server.delete<{Params: {id: string}}>("/deleteUserUnSecured/:id", {preHandler: badAuthorization()}, deleteUserHander);

};
