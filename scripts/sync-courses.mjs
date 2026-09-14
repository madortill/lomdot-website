import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(SCRIPT_DIR, "..");
const COURSES_PATH = path.join(PROJECT_DIR, "src/data/courses.json");
const CONFIG_PATH = path.join(SCRIPT_DIR, "course-sync.config.json");

const MONTHS = new Map([
  ["ינואר", 1], ["פברואר", 2], ["מרץ", 3], ["אפריל", 4],
  ["מאי", 5], ["יוני", 6], ["יולי", 7], ["אוגוסט", 8],
  ["ספטמבר", 9], ["אוקטובר", 10], ["נובמבר", 11], ["דצמבר", 12],
]);

const BASES = {
  "6": { baseId: "bhd6", baseName: "בה״ד 6" },
  "10": { baseId: "bhd10", baseName: "בה״ד 10" },
  "11": { baseId: "bhd11", baseName: "בה״ד 11" },
  "13": { baseId: "bhd13", baseName: "בה״ד 13" },
  "20": { baseId: "bhd20", baseName: "בה״ד 20" },
};

const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "madortill-course-sync",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

function decodeEntities(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function cleanText(value) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textElements(source) {
  const elements = [];
  const pattern = /<(h[1-6]|p|li|span)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = pattern.exec(source))) {
    const text = cleanText(match[2]);
    if (text) elements.push({ tag: match[1].toLowerCase(), text });
  }

  return elements;
}

function isDeveloperLabel(value) {
  const label = value.replace(/[״׳"']/g, "").replace(/:$/, "").trim();
  return /^(?:מפתחת ראשית|מפתח ראשי|מפתחות(?: האתר| הלומדה| לומדה)?|מפתחים(?: ראשיים)?|פיתוח(?: האתר| הלומדה| לומדה)?)$/.test(label);
}

function stripRank(value) {
  const withoutRank = value.replace(
    /^(?:(?:טוראי|רב[״"']?ט|סמל|סמ[״"']?ר|רס[״"']?ל|רס[״"']?ר|רס[״"']?מ|רנ[״"']?ג|סג[״"']?ם|סגן|סרן|רס[״"']?ן|רב[- ]?סרן|סא[״"']?ל|אל[״"']?ם|תא[״"']?ל|אלוף)\s+)+/u,
    "",
  );
  return withoutRank.replace(/[,:;]+$/, "").trim();
}

function looksLikeSectionLabel(value) {
  return /:$/.test(value.trim()) || /^(?:גרסה|גרפיקה|מומחי תוכן|רמ[״"']?ד|מפקד)/.test(value.trim());
}

export function extractDevelopers(source) {
  const elements = textElements(source);
  const developers = [];

  for (let index = 0; index < elements.length; index += 1) {
    if (!isDeveloperLabel(elements[index].text)) continue;

    for (let cursor = index + 1; cursor < elements.length; cursor += 1) {
      const candidate = elements[cursor];
      if (candidate.tag.startsWith("h") || looksLikeSectionLabel(candidate.text)) break;

      const name = stripRank(candidate.text);
      if (name && name.length <= 80 && !developers.includes(name)) developers.push(name);
    }
  }

  return developers;
}

function isoDate(year, month = 1, day = 1) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function extractVersionDate(source) {
  const elements = textElements(source);
  const versionValues = [];

  for (let index = 0; index < elements.length; index += 1) {
    if (/^גרסה\s*:?$/.test(elements[index].text)) {
      versionValues.push(elements[index + 1]?.text ?? "");
    }
  }
  versionValues.push(source);

  for (const value of versionValues) {
    const fullDate = value.match(/\b(\d{1,2})[./-](\d{1,2})[./-](20\d{2})\b/);
    if (fullDate) return isoDate(Number(fullDate[3]), Number(fullDate[2]), Number(fullDate[1]));

    for (const [monthName, monthNumber] of MONTHS) {
      const monthYear = value.match(new RegExp(`${monthName}\\s+(20\\d{2})`));
      if (monthYear) return isoDate(Number(monthYear[1]), monthNumber, 1);
    }
  }

  return "";
}

function titleFromSource(source, filePath) {
  if (/index\.html$/i.test(filePath)) {
    const match = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = cleanText(match?.[1] ?? "");
    if (title && !/^(?:vite|react app|vue app)$/i.test(title)) return title;
  }

  if (/readme\.md$/i.test(filePath)) {
    const match = source.match(/^#\s+(.+)$/m);
    if (match?.[1]) return cleanText(match[1]);
  }

  if (/package\.json$/i.test(filePath)) {
    try {
      return JSON.parse(source).displayName ?? "";
    } catch {
      return "";
    }
  }

  const heading = textElements(source).find(({ tag, text }) => tag === "h1" && text.length <= 100);
  return heading?.text ?? "";
}

function inferBase(repositoryName, treePaths, sources) {
  const repositoryText = repositoryName.replace(/[_-]+/g, " ");
  const allText = `${repositoryText}\n${treePaths.join("\n")}\n${sources.join("\n")}`;
  const strongMatch = repositoryText.match(/(?:bhd|bahad|בה[״"']?ד)\s*(6|10|11|13|20)\b/i);
  const generalMatch = allText.match(/(?:bhd|bahad|בה[״"']?ד)[_\s-]*(6|10|11|13|20)\b/i);
  const number = strongMatch?.[1] ?? generalMatch?.[1];

  if (number) return BASES[number];
  if (/חינוך|hinuch|education/i.test(allText)) return { baseId: "education", baseName: "בה״ד חינוך" };
  if (/מפקדה|mifkada|headquarters/i.test(repositoryText)) return { baseId: "hq", baseName: "מפקדה" };
  return { baseId: "", baseName: "" };
}

function humanizeRepositoryName(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function repositoryNameFromCourse(course, owner) {
  if (course.repository) {
    const parts = course.repository.replace(/\/$/, "").split("/");
    return parts.at(-1)?.toLowerCase() ?? "";
  }

  try {
    const url = new URL(course.url);
    if (url.hostname.toLowerCase() !== `${owner.toLowerCase()}.github.io`) return "";
    return url.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

function candidateScore(filePath) {
  const normalized = filePath.toLowerCase();
  let score = 0;
  if (/(^|\/)about[^/]*\.(?:jsx?|tsx?|vue)$/.test(normalized)) score += 120;
  if (/(^|\/)index\.html$/.test(normalized)) score += 100;
  if (/(^|\/)package\.json$/.test(normalized)) score += 90;
  if (/(^|\/)readme\.md$/.test(normalized)) score += 80;
  if (/(^|\/)(?:app|home|start|opening|main)[^/]*\.(?:jsx?|tsx?|vue)$/.test(normalized)) score += 70;
  if (normalized.startsWith("src/")) score += 10;
  return score;
}

async function apiJson(url, { optional = false } = {}) {
  const response = await fetch(url, { headers: API_HEADERS });
  if (optional && response.status === 404) return null;
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const hint = remaining === "0" && !process.env.GITHUB_TOKEN
      ? " הגדירי GITHUB_TOKEN והריצי שוב."
      : "";
    throw new Error(`GitHub API returned ${response.status} for ${url}.${hint}`);
  }
  return response.json();
}

async function listRepositories(owner) {
  const repositories = [];
  for (let page = 1; ; page += 1) {
    const batch = await apiJson(`https://api.github.com/users/${owner}/repos?per_page=100&page=${page}`);
    repositories.push(...batch);
    if (batch.length < 100) break;
  }
  return repositories;
}

async function fetchRawFile(owner, repository, branch, filePath) {
  const url = `https://raw.githubusercontent.com/${owner}/${repository}/${encodeURIComponent(branch)}/${filePath.split("/").map(encodeURIComponent).join("/")}`;
  const response = await fetch(url, { headers: { "User-Agent": "madortill-course-sync" } });
  return response.ok ? response.text() : "";
}

async function inspectRepository(owner, repository) {
  const branch = encodeURIComponent(repository.default_branch);
  const tree = await apiJson(
    `https://api.github.com/repos/${owner}/${repository.name}/git/trees/${branch}?recursive=1`,
    { optional: true },
  );
  const treeFiles = (tree?.tree ?? []).filter((item) => item.type === "blob");
  const candidates = treeFiles
    .filter((item) => item.size <= 350_000 && /\.(?:jsx?|tsx?|vue|html|md|json)$/i.test(item.path))
    .map((item) => ({ ...item, score: candidateScore(item.path) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.path.length - b.path.length)
    .slice(0, 18);

  const inspected = await Promise.all(candidates.map(async (item) => ({
    path: item.path,
    source: await fetchRawFile(owner, repository.name, repository.default_branch, item.path),
  })));
  const sources = inspected.map((item) => item.source).filter(Boolean);
  const developers = [...new Set(sources.flatMap(extractDevelopers))];
  const versionDate = sources.map(extractVersionDate).find(Boolean) ?? "";
  const title = inspected.map((item) => titleFromSource(item.source, item.path)).find(Boolean)
    || repository.description
    || humanizeRepositoryName(repository.name);
  const base = inferBase(repository.name, treeFiles.map((item) => item.path), sources);

  return { developers, versionDate, title, base };
}

function buildCourse(repository, inspection, owner, override = {}) {
  const completionDate = inspection.versionDate || repository.created_at.slice(0, 10);
  return {
    id: repository.name,
    title: inspection.title,
    developer: inspection.developers.join(", "),
    baseId: inspection.base.baseId,
    baseName: inspection.base.baseName,
    year: Number(completionDate.slice(0, 4)),
    completionDate,
    platforms: [],
    description: repository.description ?? "",
    url: repository.homepage?.startsWith("http") && repository.homepage !== "https://github.com"
      ? repository.homepage
      : `https://${owner}.github.io/${repository.name}/`,
    cover: "",
    repository: repository.html_url,
    ...override,
  };
}

function fillEmptyFields(existing, generated) {
  const merged = { ...existing };
  for (const [key, value] of Object.entries(generated)) {
    const current = merged[key];
    const isEmpty = current === "" || current == null || (Array.isArray(current) && current.length === 0);
    if (isEmpty && value !== "" && value != null) merged[key] = value;
  }
  return merged;
}

function parseArguments(argv) {
  const repositories = argv.find((value) => value.startsWith("--repos="))
    ?.slice("--repos=".length).split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const limitValue = argv.find((value) => value.startsWith("--limit="))?.slice("--limit=".length);
  return {
    dryRun: argv.includes("--dry-run"),
    repositories: repositories?.length ? new Set(repositories) : null,
    limit: limitValue ? Number(limitValue) : null,
  };
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

export async function syncCourses(argv = process.argv.slice(2)) {
  const args = parseArguments(argv);
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  const existingCourses = JSON.parse(await readFile(COURSES_PATH, "utf8"));
  const excluded = new Set(config.excludeRepositories.map((name) => name.toLowerCase()));
  const allRepositories = await listRepositories(config.owner);
  let repositories = allRepositories.filter((repository) => (
    repository.has_pages
    && !repository.fork
    && !repository.archived
    && !excluded.has(repository.name.toLowerCase())
    && (!args.repositories || args.repositories.has(repository.name.toLowerCase()))
  ));
  if (Number.isFinite(args.limit)) repositories = repositories.slice(0, args.limit);

  console.log(`Scanning ${repositories.length} published repositories from ${config.owner}...`);
  const generated = await mapWithConcurrency(repositories, 6, async (repository, index) => {
    let inspection;
    try {
      inspection = await inspectRepository(config.owner, repository);
    } catch (error) {
      console.warn(`Could not inspect ${repository.name}; using repository metadata. ${error.message}`);
      inspection = {
        developers: [],
        versionDate: "",
        title: repository.description || humanizeRepositoryName(repository.name),
        base: inferBase(repository.name, [], []),
      };
    }
    console.log(`[${index + 1}/${repositories.length}] ${repository.name}`);
    return buildCourse(repository, inspection, config.owner, config.overrides[repository.name] ?? {});
  });

  const generatedByRepository = new Map(generated.map((course) => [
    repositoryNameFromCourse(course, config.owner), course,
  ]));
  const mergedCourses = existingCourses.map((course) => {
    const repositoryName = repositoryNameFromCourse(course, config.owner);
    const generatedCourse = generatedByRepository.get(repositoryName);
    if (!generatedCourse) return course;
    generatedByRepository.delete(repositoryName);
    return {
      ...fillEmptyFields(course, generatedCourse),
      ...(config.overrides[generatedCourse.id] ?? {}),
    };
  });
  mergedCourses.push(...generatedByRepository.values());

  if (!args.dryRun) {
    await writeFile(COURSES_PATH, `${JSON.stringify(mergedCourses, null, 2)}\n`, "utf8");
  }

  const incomplete = mergedCourses.filter((course) => (
    !course.developer || !course.baseId || !course.cover || !course.platforms?.length
  ));
  console.log(`${args.dryRun ? "Would write" : "Wrote"} ${mergedCourses.length} courses (${generated.length} repositories scanned).`);
  console.log(`${incomplete.length} courses still have fields for manual completion.`);
  return mergedCourses;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncCourses().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
