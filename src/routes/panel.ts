import { FastifyInstance, FastifyRequest } from "fastify";
import { deleteUserHander, getAllUsersHandler, getNumOfUsersHandler } from "../BL/panelBL";
import { authorization } from "../middleware/authorization";

export const panelRoutes = (server: FastifyInstance) => {
  server.get("/getTotalUsers", {preHandler: [authorization(["admin"])]}, getNumOfUsersHandler);
  server.get("/getAll", {preHandler: [authorization(["admin"])]}, getAllUsersHandler);
  server.get("/getAllUnsecured", getAllUsersHandler);
  server.delete<{Params: {id: string}}>("/deleteUser/:id", {preHandler: [authorization(["admin"])]}, deleteUserHander);
  server.delete<{Params: {id: string}}>("/deleteUserUnSecured/:id", deleteUserHander);

};
