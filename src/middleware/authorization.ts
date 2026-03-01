import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/User";
import { createHmac } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { getKidVulnEnabled } from "../BL/kidBL";

const base64urlDecode = (input: string): string =>
  Buffer.from(input, "base64url").toString("utf-8");

const hmacSha256 = (data: string, secret: string): string =>
  createHmac("sha256", secret).update(data).digest("base64url");

// VULNERABLE: resolves kid directly to a file path with no sanitization
const verifyWithKid = (token: string): User | null => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  let header: Record<string, unknown>;
  try {
    header = JSON.parse(base64urlDecode(headerB64));
  } catch {
    return null;
  }

  const kid = header.kid as string;
  const keyPath = join(process.cwd(), "keys", `${kid}.key`);

  let secret: string;
  try {
    secret = readFileSync(keyPath, "utf-8").trim();
  } catch (e) {
    return null;
  }

  const expected = hmacSha256(`${headerB64}.${payloadB64}`, secret);
  if (expected !== sigB64) return null;

  try {
    return JSON.parse(base64urlDecode(payloadB64)) as User;
  } catch {
    return null;
  }
};

export const authorization = (allowedRoles: string[] = []) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let token = request.cookies?.token;

      if (!token && request.headers["authorization"]) {
        const authHeader = request.headers["authorization"] as string;
        if (authHeader.startsWith("Bearer ")) token = authHeader.slice(7);
      }

      if (!token) {
        return reply
          .status(StatusCodes.UNAUTHORIZED)
          .send({ error: "Unauthorized" });
      }

      let payload: User;

      // Check if the token header contains a kid field
      let tokenKid: string | undefined;
      try {
        const header = JSON.parse(base64urlDecode(token.split(".")[0]));
        tokenKid = header.kid as string | undefined;
      } catch { /* ignore */ }

      if (getKidVulnEnabled() && tokenKid !== undefined) {
        // VULNERABLE path: kid present and vuln is enabled — use file-based key lookup
        const result = verifyWithKid(token);
        if (!result) {
          return reply.status(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
        }
        payload = result;
      } else {
        // Secure path: standard @fastify/jwt verification with fixed secret
        request.headers.authorization = `Bearer ${token}`;
        payload = (await request.jwtVerify()) as User;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        return reply.status(StatusCodes.FORBIDDEN).send({ error: "Forbidden" });
      }

      request.user = payload;
    } catch (err) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Unauthorized" });
    }
  };
};
