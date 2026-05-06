import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "../../../lib/prisma"

const router = Router()

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ message: "Champs manquants." })

        const user = await prisma.user.findUnique({ where: { email } })

        let isValid = false
        if (user) {
            isValid = await bcrypt.compare(password, user.password as string)
        }

        if (!user || !isValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." })
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }  // 15 minutes au lieu de 7 jours
        )

        res.cookie("access_token", accessToken, {
            httpOnly: true,                    // Inaccessible à JavaScript (anti-XSS)
            secure: process.env.NODE_ENV === "production",  // HTTPS uniquement en prod
            sameSite: "strict",                // Protège contre CSRF
            maxAge: 15 * 60 * 1000             // 15 minutes en millisecondes
        })

        return res.status(200).json({ message: "Authentifié avec succès." })

    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur." })
    }
})

export default router