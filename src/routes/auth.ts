import { FastifyInstance} from "fastify";
import { getBacVulnHandler, getKidVulnHandler, GetUserHandler, loginHandler, logoutHandler, toggleBacVulnHandler, toggleKidVulnHandler } from "../BL/authBL";
import { authorization } from "../middleware/authorization";

export const authRouts = (server: FastifyInstance) => {
    server.post('/login', loginHandler);
    server.get('/getUser', {preHandler: [authorization()]}, GetUserHandler);
    server.post('/logout', logoutHandler)

      server.get("/kidVuln", getKidVulnHandler);
      server.post("/kidVuln", toggleKidVulnHandler);
      server.get("/bacVuln", getBacVulnHandler );
      server.post("/bacVuln", toggleBacVulnHandler);
} 