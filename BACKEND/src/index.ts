import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import register from "./routes/auth/register/register";
import login from "./routes/auth/login/login";
import { errorHandle } from "./middlewares/HandleError";
import offers from "./routes/offers/offers";
import me from "./routes/user/me";
import users from "./routes/user/users";
import stats from "./routes/stats/stats";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(errorHandle);

app.use("/auth", register);
app.use("/auth", login);
app.use("/", offers);
app.use("/", me);
app.use("/", users);
app.use("/", stats);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
