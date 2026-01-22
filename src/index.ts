import fastify from "fastify";
import { authRouts } from "./routes/auth";
import fastifyCookie from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { connectToDB } from "./mongoDB/connectToDB";

const start = async () => {
  const server = fastify({
    logger: true,
  });

  try {
    connectToDB();

    server.register(fastifyCookie);
    server.register(fastifyJwt, {
      secret: "yogev",
    });

    server.register(authRouts, { prefix: "/auth" });

    server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server listening at ${address}`);
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
