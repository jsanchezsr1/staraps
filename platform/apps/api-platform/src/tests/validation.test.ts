import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app";

test("POST /api/auth/register validates request body", async () => {
  const app = createApp();
  const response = await request(app).post("/api/auth/register").send({ email: "bad" });
  assert.equal(response.status, 400);
});
