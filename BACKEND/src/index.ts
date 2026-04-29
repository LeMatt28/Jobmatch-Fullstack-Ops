import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import register from "./routes/auth/register/register";
import login from "./routes/auth/login/login";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", register);
app.use("/auth", login);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
