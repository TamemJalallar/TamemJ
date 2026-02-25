interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH?: string;
  GITHUB_PUBLISHED_FIXES_PATH?: string;
  PUBLISH_PATH?: string;
  ALLOWED_ORIGINS?: string;
  ALLOWED_EMAILS?: string;
  REQUIRE_CLOUDFLARE_ACCESS?: string;
  GIT_COMMIT_NAME?: string;
  GIT_COMMIT_EMAIL?: string;
}

type CorporateFixCategory =
  | "Windows"
  | "macOS"
  | "O365"
  | "Networking"
  | "Printers"
  | "Security"
  | "Adobe"
  | "Figma"
  | "Browsers";

type CorporateFixSeverity = "Low" | "Medium" | "High";
type CorporateFixAccessLevel = "User Safe" | "Admin Required";
type CorporateFixStepType = "info" | "command" | "warning";

interface CorporateFixStep {
  title: string;
  type: CorporateFixStepType;
  content: string;
}

interface CorporateTechFix {
  slug: string;
  title: string;
  category: CorporateFixCategory;
  severity: CorporateFixSeverity;
  accessLevel: CorporateFixAccessLevel;
  estimatedTime: string;
  tags: string[];
  description: string;
  steps: CorporateFixStep[];
}

interface PublishedCorporateFixesStore {
  version: 1;
  updatedAt?: string;
  updatedBy?: string;
  entries: CorporateTechFix[];
}

interface PublishRequestBody {
  fix: CorporateTechFix;
  source?: string;
  requestedAt?: string;
  commitMessage?: string;
}

interface GitHubContentsGetResponse {
  sha: string;
  content: string;
  encoding: "base64";
}

interface GitHubContentsPutResponse {
  content?: {
    path?: string;
    sha?: string;
  };
  commit?: {
    sha?: string;
    html_url?: string;
  };
}

const DEFAULT_PUBLISH_PATH = "/api/corporate-tech-fixes/publish";
const DEFAULT_REPO_FILE_PATH = "data/corporate-fixes.published.json";
const STORE_VERSION = 1 as const;

const corporateFixCategories: CorporateFixCategory[] = [
  "Windows",
  "macOS",
  "O365",
  "Networking",
  "Printers",
  "Security",
  "Adobe",
  "Figma",
  "Browsers"
];

function json(
  data: Record<string, unknown>,
  init: ResponseInit = {},
  request?: Request,
  env?: Env
): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");

  if (request && env) {
    applyCorsHeaders(headers, request, env);
  }

  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers
  });
}

function text(
  body: string,
  init: ResponseInit = {},
  request?: Request,
  env?: Env
): Response {
  const headers = new Headers(init.headers);
  if (request && env) {
    applyCorsHeaders(headers, request, env);
  }

  return new Response(body, { ...init, headers });
}

function getAllowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyCorsHeaders(headers: Headers, request: Request, env: Env): void {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins(env);

  if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }

  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
}

function shouldRequireCloudflareAccess(env: Env): boolean {
  return (env.REQUIRE_CLOUDFLARE_ACCESS ?? "true").trim().toLowerCase() !== "false";
}

function getAuthenticatedEmail(request: Request): string | null {
  const value = request.headers.get("cf-access-authenticated-user-email");
  return value ? value.trim().toLowerCase() : null;
}

function ensureAccess(request: Request, env: Env): { ok: true; email: string | null } | { ok: false; response: Response } {
  const email = getAuthenticatedEmail(request);

  if (shouldRequireCloudflareAccess(env) && !email) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          error:
            "Cloudflare Access authentication header is missing. Protect this worker route with Cloudflare Access."
        },
        { status: 401 },
        request,
        env
      )
    };
  }

  const allowedEmails = (env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (email && allowedEmails.length > 0 && !allowedEmails.includes(email)) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          error: "Authenticated user is not allowed to publish KB entries."
        },
        { status: 403 },
        request,
        env
      )
    };
  }

  return { ok: true, email };
}

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function isCategory(value: string): value is CorporateFixCategory {
  return corporateFixCategories.includes(value as CorporateFixCategory);
}

function isSeverity(value: string): value is CorporateFixSeverity {
  return value === "Low" || value === "Medium" || value === "High";
}

function isAccessLevel(value: string): value is CorporateFixAccessLevel {
  return value === "User Safe" || value === "Admin Required";
}

function isStepType(value: string): value is CorporateFixStepType {
  return value === "info" || value === "command" || value === "warning";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeFix(input: unknown): CorporateTechFix | null {
  if (!isPlainObject(input)) {
    return null;
  }

  const slug = typeof input.slug === "string" ? input.slug.trim() : "";
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const category = typeof input.category === "string" ? input.category : "";
  const severity = typeof input.severity === "string" ? input.severity : "";
  const accessLevel = typeof input.accessLevel === "string" ? input.accessLevel : "";
  const estimatedTime = typeof input.estimatedTime === "string" ? input.estimatedTime.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const tags = Array.isArray(input.tags) ? input.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const stepsInput = Array.isArray(input.steps) ? input.steps : [];

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (!title || !isCategory(category) || !isSeverity(severity) || !isAccessLevel(accessLevel)) return null;
  if (!estimatedTime || !description) return null;
  if (tags.length === 0) return null;

  const steps: CorporateFixStep[] = [];

  for (const stepInput of stepsInput) {
    if (!isPlainObject(stepInput)) {
      return null;
    }

    const stepTitle = typeof stepInput.title === "string" ? stepInput.title.trim() : "";
    const stepType = typeof stepInput.type === "string" ? stepInput.type : "";
    const stepContent = typeof stepInput.content === "string" ? stepInput.content.trim() : "";

    if (!stepTitle || !stepContent || !isStepType(stepType)) {
      return null;
    }

    steps.push({
      title: stepTitle,
      type: stepType,
      content: stepContent
    });
  }

  if (steps.length === 0) {
    return null;
  }

  return {
    slug,
    title,
    category,
    severity,
    accessLevel,
    estimatedTime,
    tags: normalizeTags(tags),
    description,
    steps
  };
}

function normalizeStore(input: unknown): PublishedCorporateFixesStore {
  if (!isPlainObject(input) || !Array.isArray(input.entries)) {
    return { version: STORE_VERSION, entries: [] };
  }

  const entries = input.entries.map(normalizeFix).filter((entry): entry is CorporateTechFix => Boolean(entry));
  return {
    version: STORE_VERSION,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : undefined,
    updatedBy: typeof input.updatedBy === "string" ? input.updatedBy : undefined,
    entries
  };
}

function repoContentsApiPath(owner: string, repo: string, filePath: string): string {
  const path = filePath
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`;
}

async function githubFetchJson<T>(url: string, init: RequestInit, env: Env): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "tamemj-corporate-fixes-publisher",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
}

function decodeBase64Utf8(value: string): string {
  const cleaned = value.replace(/\n/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

function encodeBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function loadGitHubStore(env: Env): Promise<{
  store: PublishedCorporateFixesStore;
  sha?: string;
  path: string;
}> {
  const owner = env.GITHUB_OWNER?.trim();
  const repo = env.GITHUB_REPO?.trim();
  const branch = (env.GITHUB_BRANCH ?? "main").trim();
  const path = (env.GITHUB_PUBLISHED_FIXES_PATH ?? DEFAULT_REPO_FILE_PATH).trim();

  if (!owner || !repo || !env.GITHUB_TOKEN?.trim()) {
    throw new Error("Missing GitHub worker configuration (GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN).");
  }

  const url = `${repoContentsApiPath(owner, repo, path)}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "tamemj-corporate-fixes-publisher"
    }
  });

  if (response.status === 404) {
    return {
      store: { version: STORE_VERSION, entries: [] },
      path
    };
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to load published fixes file (${response.status}): ${message}`);
  }

  const payload = (await response.json()) as GitHubContentsGetResponse;
  const content = decodeBase64Utf8(payload.content);
  const store = normalizeStore(JSON.parse(content) as unknown);

  return {
    store,
    sha: payload.sha,
    path
  };
}

async function saveGitHubStore(
  env: Env,
  options: {
    path: string;
    sha?: string;
    store: PublishedCorporateFixesStore;
    commitMessage: string;
  }
): Promise<GitHubContentsPutResponse> {
  const owner = env.GITHUB_OWNER.trim();
  const repo = env.GITHUB_REPO.trim();
  const branch = (env.GITHUB_BRANCH ?? "main").trim();
  const url = repoContentsApiPath(owner, repo, options.path);
  const content = encodeBase64Utf8(`${JSON.stringify(options.store, null, 2)}\n`);

  const body: Record<string, unknown> = {
    message: options.commitMessage,
    content,
    branch
  };

  if (options.sha) {
    body.sha = options.sha;
  }

  if (env.GIT_COMMIT_NAME?.trim() && env.GIT_COMMIT_EMAIL?.trim()) {
    body.committer = {
      name: env.GIT_COMMIT_NAME.trim(),
      email: env.GIT_COMMIT_EMAIL.trim()
    };
  }

  return githubFetchJson<GitHubContentsPutResponse>(
    url,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    },
    env
  );
}

function buildCommitMessage(
  fix: CorporateTechFix,
  body: {
    commitMessage?: unknown;
  }
): string {
  const fromRequest =
    typeof body.commitMessage === "string" && body.commitMessage.trim().length > 0
      ? body.commitMessage.trim()
      : null;

  if (fromRequest) {
    return fromRequest.slice(0, 120);
  }

  return `chore(corporate-fixes): publish ${fix.slug}`;
}

function getPublishPath(env: Env): string {
  const path = (env.PUBLISH_PATH ?? DEFAULT_PUBLISH_PATH).trim();
  return path.startsWith("/") ? path : `/${path}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const publishPath = getPublishPath(env);

    if (request.method === "OPTIONS" && url.pathname === publishPath) {
      return text("", { status: 204 }, request, env);
    }

    if (url.pathname !== publishPath) {
      return text("Not Found", { status: 404 }, request, env);
    }

    if (request.method === "GET") {
      return json(
        {
          ok: true,
          service: "corporate-fixes-publisher",
          publishPath,
          repoPath: (env.GITHUB_PUBLISHED_FIXES_PATH ?? DEFAULT_REPO_FILE_PATH).trim(),
          branch: (env.GITHUB_BRANCH ?? "main").trim(),
          cloudflareAccessRequired: shouldRequireCloudflareAccess(env)
        },
        { status: 200 },
        request,
        env
      );
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, { status: 405 }, request, env);
    }

    const access = ensureAccess(request, env);
    if (!access.ok) {
      return access.response;
    }

    let parsedBody: unknown;
    try {
      parsedBody = (await request.json()) as unknown;
    } catch {
      return json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 }, request, env);
    }

    if (!isPlainObject(parsedBody)) {
      return json({ ok: false, error: "Request payload must be an object." }, { status: 400 }, request, env);
    }

    const body = parsedBody;
    const fix = normalizeFix(body.fix);
    if (!fix) {
      return json(
        { ok: false, error: "Invalid fix payload. Ensure required fields, tags, and steps are provided." },
        { status: 422 },
        request,
        env
      );
    }

    try {
      const loaded = await loadGitHubStore(env);
      const existingIndex = loaded.store.entries.findIndex((entry) => entry.slug === fix.slug);
      const replaced = existingIndex >= 0;

      if (replaced) {
        loaded.store.entries[existingIndex] = fix;
      } else {
        loaded.store.entries.unshift(fix);
      }

      loaded.store.updatedAt = new Date().toISOString();
      if (access.email) {
        loaded.store.updatedBy = access.email;
      }

      const commitMessage = buildCommitMessage(fix, body);
      const result = await saveGitHubStore(env, {
        path: loaded.path,
        sha: loaded.sha,
        store: loaded.store,
        commitMessage
      });

      return json(
        {
          ok: true,
          result: {
            slug: fix.slug,
            replaced,
            path: loaded.path,
            commitSha: result.commit?.sha,
            commitUrl: result.commit?.html_url
          }
        },
        { status: 200 },
        request,
        env
      );
    } catch (error) {
      return json(
        {
          ok: false,
          error: error instanceof Error ? error.message : "Unexpected publish error."
        },
        { status: 500 },
        request,
        env
      );
    }
  }
};
