import { JwtPayload } from "./JWTPayload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
