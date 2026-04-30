import { Request, Response, NextFunction } from "express";

export const errorHandle = (
    err: Error,
    eq: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err.stack)
    res.status(500).json({ error: "Erreur serveur inattendue"});
};