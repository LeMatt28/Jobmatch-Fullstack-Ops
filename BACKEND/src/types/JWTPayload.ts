export interface JwtPayload {
  id: number;
  email: string;
  role: "candidate" | "company" | "admin";
}
