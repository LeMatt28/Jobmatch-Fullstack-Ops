// imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandle } from "./middlewares/HandleError";
import registerCandidate from "./routes/auth/register/registerCandidate";
import registerCompany from "./routes/auth/register/registerCompagny";
import login from "./routes/auth/login/login";
import me from "./routes/me/me";
import offers from "./routes/offers/OfferCrud";
import swipe from "./routes/offers/swipe";
import matches from "./routes/matches/matches";
import company from "./routes/compagny/compagnyCrud";
import reviews from "./routes/reviews/Reviews";
import admin from "./routes/admin/admin";

// env
dotenv.config();

//back
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/auth", registerCandidate);
app.use("/auth", registerCompany);
app.use("/auth", login);
app.use("/", me);
app.use("/", offers);
app.use("/", swipe);
app.use("/", matches);
app.use("/", company);
app.use("/", reviews);
app.use("/", admin);

// anti brut force sur la route login
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Trop de tentatives, réessayez dans 1 minute" },
});
app.use("/auth", authLimiter);

// route test
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// middleware error
app.use(errorHandle);

//juste pritnque ca marche
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
