import request from "supertest";
import express from "express";
import { errorHandle } from "../middlewares/HandleError";

import registerCandidate from "../routes/auth/register/registerCandidate";
import login from "../routes/auth/login/login";

const app = express();
app.use(express.json());
app.use("/auth", registerCandidate);
app.use("/auth", login);
app.use(errorHandle);

describe("POST /auth/register/candidate", () => {
  it("should return 400 if email is invalid", async () => {
    const res = await request(app)
      .post("/auth/register/candidate")
      .send({ email: "pasunemail", password: "password123", name: "Lucas" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is too short", async () => {
    const res = await request(app)
      .post("/auth/register/candidate")
      .send({ email: "test@test.com", password: "123", name: "Lucas" });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("should return 400 if email is invalid", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "pasunemail", password: "password123" });
    expect(res.status).toBe(400);
  });

  it("should return 401 if credentials are wrong", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "inexistant@test.com", password: "password123" });
    expect(res.status).toBe(401);
  });
});
