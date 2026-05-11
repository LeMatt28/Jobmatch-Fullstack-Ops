import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = "https://epi-api.welovedevs.com/v1";
const DEFAULT_PAGE_SIZE = 100;
const REQUEST_DELAY_MS = 1100;
const DEFAULT_PRISMA_OFFER_DELEGATE = "offer";
const DEFAULT_PRISMA_COMPANY_DELEGATE = "company";
const SOURCE_NAME = "welovedevs";
const NANOSECOND_TIMESTAMP_LIMIT = 1_000_000_000_000_000_000;
const MICROSECOND_TIMESTAMP_LIMIT = 100_000_000_000_000;
const MILLISECOND_TIMESTAMP_LIMIT = 100_000_000_000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const env = {};
  const content = fs.readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) {
      continue;
    }

    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }

  return env;
}

function readConfigValue(name) {
  if (process.env[name]) {
    return process.env[name];
  }

  const envCandidates = [
    path.join(process.cwd(), ".env"),
    path.join(__dirname, "..", ".env"),
  ];

  for (const envPath of envCandidates) {
    const env = readEnvFile(envPath);
    if (env[name]) {
      return env[name];
    }
  }

  return undefined;
}

export async function fetchJobsPage(apiKey, page = 0, size = DEFAULT_PAGE_SIZE, fetchImpl = fetch) {
  const response = await fetchImpl(`${API_URL}?page=${page}&size=${size}`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function fetchAllJobs(
  apiKey,
  { size = DEFAULT_PAGE_SIZE, delayMs = REQUEST_DELAY_MS, fetchImpl = fetch } = {},
) {
  const jobs = [];
  let page = 0;

  while (true) {
    if (page > 0) {
      await sleep(delayMs);
    }

    const payload = await fetchJobsPage(apiKey, page, size, fetchImpl);
    const values = payload.values ?? [];

    if (values.length === 0) {
      break;
    }

    jobs.push(...values);

    if (values.length < size) {
      break;
    }

    page += 1;
  }

  return jobs;
}

function firstValue(values) {
  return values?.length ? values[0] : null;
}

function eurosFromThousands(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue * 1000) : null;
}

function formatPublishDate(timestamp) {
  if (!timestamp) {
    return null;
  }

  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) {
    return null;
  }

  if (numericTimestamp > NANOSECOND_TIMESTAMP_LIMIT) {
    return new Date(numericTimestamp / 1_000_000).toISOString();
  }

  if (numericTimestamp > MICROSECOND_TIMESTAMP_LIMIT) {
    return new Date(numericTimestamp / 1000).toISOString();
  }

  if (numericTimestamp > MILLISECOND_TIMESTAMP_LIMIT) {
    return new Date(numericTimestamp).toISOString();
  }

  return new Date(numericTimestamp * 1000).toISOString();
}

const CONTRACT_TYPE_MAPPING = {
  cdi: "CDI",
  permanent: "CDI",
  permanent_contract: "CDI",
  cdd: "CDD",
  fixed_term: "CDD",
  "fixed-term": "CDD",
  temporary: "CDD",
  stage: "STAGE",
  intern: "STAGE",
  internship: "STAGE",
  alternance: "ALTERNANCE",
  apprenticeship: "ALTERNANCE",
  work_study: "ALTERNANCE",
  "work-study": "ALTERNANCE",
  freelance: "FREELANCE",
  contractor: "FREELANCE",
};

function normalizeContractType(contractType) {
  if (!contractType) {
    return null;
  }

  const value = String(contractType).trim();

  if (Object.values(CONTRACT_TYPE_MAPPING).includes(value.toUpperCase())) {
    return value.toUpperCase();
  }

  return CONTRACT_TYPE_MAPPING[value.toLowerCase()] ?? null;
}

export function normalizeJob(rawJob) {
  const details = rawJob.details ?? {};
  const salary = details.salary ?? {};
  const remotePolicy = details.remotePolicy ?? {};

  const description =
    rawJob.description ??
    rawJob.rawDescription ??
    rawJob.descriptionPreview ??
    "";

  const stack = (rawJob.skillsList ?? [])
    .map((skill) => skill?.name)
    .filter(Boolean);
  const companyName = rawJob.smallCompany?.companyName ?? "Entreprise inconnue";

  return {
    sourceId: String(rawJob.id ?? "").trim(),
    source: SOURCE_NAME,
    title: String(rawJob.title ?? "").trim(),
    companyName,
    location: firstValue(rawJob.formattedPlaces ?? []),
    contractType: normalizeContractType(firstValue(rawJob.contractTypes ?? [])),
    description,
    salaryMin: eurosFromThousands(salary.min),
    salaryMax: eurosFromThousands(salary.max),
    stack,
    publishedAt: formatPublishDate(rawJob.publishDate),
    remote: remotePolicy.frequency ?? null,
    isActive: true,
  };
}

export function dedupeJobsBySourceId(jobs) {
  const seenSourceIds = new Set();
  const uniqueJobs = [];

  for (const job of jobs) {
    if (!job.sourceId || seenSourceIds.has(job.sourceId)) {
      continue;
    }

    seenSourceIds.add(job.sourceId);
    uniqueJobs.push(job);
  }

  return uniqueJobs;
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function shortHash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 12);
}

function buildExternalCompanyEmail(companyName, sourceId) {
  const slug = slugify(companyName) || "company";
  return `${SOURCE_NAME}-${slug}-${shortHash(`${companyName}:${sourceId}`)}@external.local`;
}

function buildExternalCompanyPassword(companyName, sourceId) {
  return `external-${SOURCE_NAME}-${shortHash(`${sourceId}:${companyName}:password`)}`;
}

function getModelField(Prisma, modelName, fieldName) {
  const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName);
  return model?.fields.find((field) => field.name === fieldName) ?? null;
}

function getModelFieldNames(Prisma, modelName) {
  const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName);
  return new Set(model?.fields.map((field) => field.name) ?? []);
}

function pickKnownFields(data, knownFields) {
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => knownFields.has(key) && value !== undefined),
  );
}

async function upsertExternalCompany(companyDelegate, job, companyFields) {
  const companyName = job.companyName || "Entreprise inconnue";
  const email = buildExternalCompanyEmail(companyName, job.sourceId);

  const createData = pickKnownFields(
    {
      email,
      password: buildExternalCompanyPassword(companyName, job.sourceId),
      name: companyName,
      values: [],
      description: `Entreprise importee depuis ${SOURCE_NAME}`,
    },
    companyFields,
  );

  const updateData = pickKnownFields(
    {
      name: companyName,
      description: `Entreprise importee depuis ${SOURCE_NAME}`,
    },
    companyFields,
  );

  return companyDelegate.upsert({
    where: { email },
    update: updateData,
    create: createData,
  });
}

function buildOfferData(job, companyId, offerFields) {
  return pickKnownFields(
    {
      sourceId: job.sourceId,
      source: job.source,
      companyId,
      title: job.title || "Offre sans titre",
      description: job.description || "Description indisponible",
      stack: job.stack ?? [],
      location: job.location,
      contractType: job.contractType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      remote: job.remote,
      isActive: job.isActive,
      publishedAt: job.publishedAt,
    },
    offerFields,
  );
}

async function upsertOffer(offerDelegate, job, companyId, offerFields, sourceIdField) {
  const offerData = buildOfferData(job, companyId, offerFields);

  if (sourceIdField?.isUnique || sourceIdField?.isId) {
    return offerDelegate.upsert({
      where: { sourceId: job.sourceId },
      update: offerData,
      create: offerData,
    });
  }

  const existingOffer = await offerDelegate.findFirst({
    where: pickKnownFields(
      {
        title: offerData.title,
        companyId,
        location: offerData.location,
        contractType: offerData.contractType,
      },
      offerFields,
    ),
  });

  if (existingOffer) {
    return offerDelegate.update({
      where: { id: existingOffer.id },
      data: offerData,
    });
  }

  return offerDelegate.create({ data: offerData });
}

export async function upsertJobsIntoDatabase(
  jobs,
  {
    offerDelegateName = DEFAULT_PRISMA_OFFER_DELEGATE,
    companyDelegateName = DEFAULT_PRISMA_COMPANY_DELEGATE,
  } = {},
) {
  const { Prisma, PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const offerDelegate = prisma[offerDelegateName];
  const companyDelegate = prisma[companyDelegateName];

  if (!offerDelegate || typeof offerDelegate.create !== "function") {
    await prisma.$disconnect();
    throw new Error(
      `Le delegate Prisma "${offerDelegateName}" est introuvable. Modifie PRISMA_OFFER_DELEGATE.`,
    );
  }

  if (!companyDelegate || typeof companyDelegate.upsert !== "function") {
    await prisma.$disconnect();
    throw new Error(
      `Le delegate Prisma "${companyDelegateName}" est introuvable. Modifie PRISMA_COMPANY_DELEGATE.`,
    );
  }

  try {
    let index = 0;
    const offerFields = getModelFieldNames(Prisma, "Offer");
    const companyFields = getModelFieldNames(Prisma, "Company");
    const sourceIdField = getModelField(Prisma, "Offer", "sourceId");

    for (const job of jobs) {
      const company = await upsertExternalCompany(companyDelegate, job, companyFields);
      await upsertOffer(offerDelegate, job, company.id, offerFields, sourceIdField);

      index += 1;
      if (index % 100 === 0) {
        console.log(`${index} offres inserees ou mises a jour...`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function main() {
  const apiKey = readConfigValue("WELOVEDEVS_API_KEY");
  if (!apiKey) {
    throw new Error("WELOVEDEVS_API_KEY introuvable dans l'environnement ou dans .env");
  }

  const offerDelegateName =
    readConfigValue("PRISMA_OFFER_DELEGATE") ??
    readConfigValue("PRISMA_JOB_DELEGATE") ??
    DEFAULT_PRISMA_OFFER_DELEGATE;
  const companyDelegateName =
    readConfigValue("PRISMA_COMPANY_DELEGATE") ?? DEFAULT_PRISMA_COMPANY_DELEGATE;
  const rawJobs = await fetchAllJobs(apiKey);
  const normalizedJobs = rawJobs.map(normalizeJob);
  const uniqueJobs = dedupeJobsBySourceId(normalizedJobs);

  await upsertJobsIntoDatabase(uniqueJobs, { offerDelegateName, companyDelegateName });
  console.log(`${uniqueJobs.length} offres inserees ou mises a jour en base.`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
