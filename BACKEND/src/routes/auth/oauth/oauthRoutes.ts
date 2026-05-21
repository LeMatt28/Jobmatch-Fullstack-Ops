import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../../../lib/prisma";

const router = Router();

const PROVIDERS = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "email profile",
    clientId: () => process.env.GOOGLE_CLIENT_ID!,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET!,
  },
  discord: {
    authUrl: "https://discord.com/api/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    profileUrl: "https://discord.com/api/users/@me",
    scope: "identify email",
    clientId: () => process.env.DISCORD_CLIENT_ID!,
    clientSecret: () => process.env.DISCORD_CLIENT_SECRET!,
  },
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    profileUrl: "https://api.github.com/user",
    scope: "read:user user:email",
    clientId: () => process.env.GITHUB_CLIENT_ID!,
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET!,
  },
} as const;

type Provider = keyof typeof PROVIDERS;
type Role = "candidate" | "company";

function getRedirectUri(provider: Provider): string {
  return `${process.env.BACKEND_URL ?? "http://localhost:3001"}/auth/${provider}/callback`;
}

function getFrontendUrl(): string {
  return process.env.FRONTEND_URL ?? "http://localhost:5173";
}

router.get("/:provider/redirect", (req, res) => {
  const provider = req.params.provider as Provider;
  const role = req.query.role as Role;

  if (!PROVIDERS[provider]) {
    return res.status(400).json({ error: "Provider inconnu" });
  }
  if (!["candidate", "company"].includes(role)) {
    return res.status(400).json({ error: "Rôle invalide" });
  }

  const config = PROVIDERS[provider];

  const state = jwt.sign(
    { role, nonce: crypto.randomBytes(16).toString("hex") },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" }
  );

  const params = new URLSearchParams({
    client_id: config.clientId(),
    redirect_uri: getRedirectUri(provider),
    scope: config.scope,
    state,
  });

  if (provider !== "github") {
    params.set("response_type", "code");
  }

  return res.redirect(`${config.authUrl}?${params.toString()}`);
});

router.get("/:provider/callback", async (req, res) => {
  const provider = req.params.provider as Provider;
  const { code, state, error } = req.query as Record<string, string>;
  const frontendUrl = getFrontendUrl();

  if (error) {
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent("Connexion SSO annulée")}`
    );
  }

  if (!PROVIDERS[provider]) {
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent("Provider inconnu")}`
    );
  }

  let statePayload: { role: Role; nonce: string };
  try {
    statePayload = jwt.verify(state, process.env.JWT_SECRET as string, { algorithms: ["HS256"] }) as any;
  } catch {
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent("Session expirée, veuillez réessayer")}`
    );
  }

  const { role } = statePayload;
  const config = PROVIDERS[provider];

  try {
    const tokenBody = new URLSearchParams({
      client_id: config.clientId(),
      client_secret: config.clientSecret(),
      code,
      redirect_uri: getRedirectUri(provider),
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: tokenBody.toString(),
    });

    const tokenData = (await tokenRes.json()) as any;
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("No access token");

    let profile: any;
    if (provider === "github") {
      const [userRes, emailsRes] = await Promise.all([
        fetch(config.profileUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "User-Agent": "JobAggregator",
          },
        }),
        fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "User-Agent": "JobAggregator",
          },
        }),
      ]);
      const userData = (await userRes.json()) as any;
      const emails = (await emailsRes.json()) as any[];
      const primaryEmail =
        emails.find((e) => e.primary && e.verified)?.email ?? userData.email;
      profile = { ...userData, email: primaryEmail };
    } else {
      const profileRes = await fetch(config.profileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      profile = await profileRes.json();
    }

    const oauthEmail = (profile.email as string)?.toLowerCase();
    const oauthProviderId = String(profile.sub ?? profile.id);

    if (!oauthEmail) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent("Email non disponible depuis ce provider")}`
      );
    }

    let firstName: string;
    let lastName: string;

    if (provider === "google") {
      firstName = profile.given_name ?? oauthEmail.split("@")[0];
      lastName = profile.family_name ?? "";
    } else if (provider === "discord") {
      const displayName: string =
        profile.global_name ?? profile.username ?? oauthEmail.split("@")[0];
      const parts = displayName.split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    } else {
      const displayName: string =
        profile.name ?? profile.login ?? oauthEmail.split("@")[0];
      const parts = displayName.split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }


    let userId: number;

    if (role === "candidate") {
      let candidate = await prisma.candidate.findFirst({
        where: { oauthProvider: provider, oauthProviderId },
      });

      if (!candidate) {
        candidate = await prisma.candidate.findUnique({
          where: { email: oauthEmail },
        });
      }

      if (!candidate) {
        candidate = await prisma.candidate.create({
          data: {
            email: oauthEmail,
            firstName,
            lastName,
            oauthProvider: provider,
            oauthProviderId,
            skills: [],
            softSkills: [],
          },
        });
      } else if (!candidate.oauthProvider) {
        candidate = await prisma.candidate.update({
          where: { id: candidate.id },
          data: { oauthProvider: provider, oauthProviderId },
        });
      }

      userId = candidate.id;
    } else {
      const companyName =
        provider === "google"
          ? (profile.name ?? oauthEmail.split("@")[0])
          : (profile.global_name ?? profile.name ?? profile.username ?? profile.login ?? oauthEmail.split("@")[0]);

      let company = await prisma.company.findFirst({
        where: { oauthProvider: provider, oauthProviderId },
      });

      if (!company) {
        company = await prisma.company.findUnique({
          where: { email: oauthEmail },
        });
      }

      if (!company) {
        company = await prisma.company.create({
          data: {
            email: oauthEmail,
            name: companyName,
            oauthProvider: provider,
            oauthProviderId,
            values: [],
          },
        });
      } else if (!company.oauthProvider) {
        company = await prisma.company.update({
          where: { id: company.id },
          data: { oauthProvider: provider, oauthProviderId },
        });
      }

      userId = company.id;
    }

    const token = jwt.sign(
      { id: userId, email: oauthEmail, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&role=${role}`
    );
  } catch (err) {
    console.error("OAuth error:", err);
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent("Erreur lors de la connexion SSO")}`
    );
  }
});

export default router;