export interface JwtPayload {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
}