import test from "node:test";
import assert from "node:assert/strict";
import { parseEnv } from "../env";

test("env schema parses", async () => {
  const env = parseEnv({
    DATABASE_URL: "postgres://x",
    REDIS_URL: "redis://x",
    JWT_SECRET: "1234567890123456",
    NEXT_PUBLIC_API_URL: "http://localhost:4000"
  });
  assert.equal(env.PORT, "4000");
});
