import {
  readFile,
} from "node:fs/promises";

import {
  fileURLToPath,
} from "node:url";

import {
  dirname,
  resolve,
} from "node:path";

const currentFile =
  fileURLToPath(import.meta.url);

const currentDirectory =
  dirname(currentFile);

const projectRoot =
  resolve(
    currentDirectory,
    "..",
  );

const registryPath =
  resolve(
    projectRoot,
    "src/experiments/registry.ts",
  );

const modulesPath =
  resolve(
    projectRoot,
    "src/experiments/modules.ts",
  );

const [
  registrySource,
  modulesSource,
] = await Promise.all([
  readFile(
    registryPath,
    "utf8",
  ),
  readFile(
    modulesPath,
    "utf8",
  ),
]);

function extractRegistryEntries(
  source,
) {
  const entries = [];

  const entryPattern =
    /\{\s*slug:\s*"([^"]+)"[\s\S]*?status:\s*"(ready|planned)"[\s\S]*?\}/g;

  for (
    const match of
    source.matchAll(entryPattern)
  ) {
    entries.push({
      slug: match[1],
      status: match[2],
    });
  }

  return entries;
}

function extractRuntimeSlugs(
  source,
) {
  const modulesMatch =
    source.match(
      /export const experimentModules\s*=\s*\{([\s\S]*?)\}\s*as const\s*;/,
    );

  if (!modulesMatch) {
    throw new Error(
      "Không tìm thấy experimentModules trong src/experiments/modules.ts",
    );
  }

  const objectBody =
    modulesMatch[1];

  const slugs = [];

  const keyPattern =
    /^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:/gm;

  for (
    const match of
    objectBody.matchAll(keyPattern)
  ) {
    const slug =
      match[1] ??
      match[2] ??
      match[3];

    slugs.push(slug);
  }

  return slugs;
}

function findDuplicates(
  values,
) {
  const seen =
    new Set();

  const duplicates =
    new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [
    ...duplicates,
  ];
}

const registryEntries =
  extractRegistryEntries(
    registrySource,
  );

const runtimeSlugs =
  extractRuntimeSlugs(
    modulesSource,
  );

const errors = [];

if (registryEntries.length === 0) {
  errors.push(
    "Không đọc được experiment nào từ registry.ts",
  );
}

const registrySlugs =
  registryEntries.map(
    (entry) => entry.slug,
  );

const duplicateRegistrySlugs =
  findDuplicates(
    registrySlugs,
  );

for (
  const slug of
  duplicateRegistrySlugs
) {
  errors.push(
    `Registry có slug trùng: "${slug}"`,
  );
}

const duplicateRuntimeSlugs =
  findDuplicates(
    runtimeSlugs,
  );

for (
  const slug of
  duplicateRuntimeSlugs
) {
  errors.push(
    `Runtime modules có slug trùng: "${slug}"`,
  );
}

const runtimeSlugSet =
  new Set(
    runtimeSlugs,
  );

const registrySlugSet =
  new Set(
    registrySlugs,
  );

for (
  const experiment of
  registryEntries
) {
  if (
    experiment.status === "ready" &&
    !runtimeSlugSet.has(
      experiment.slug,
    )
  ) {
    errors.push(
      `Experiment "${experiment.slug}" có status "ready" nhưng không có runtime module.`,
    );
  }
}

for (
  const slug of
  runtimeSlugs
) {
  if (
    !registrySlugSet.has(slug)
  ) {
    errors.push(
      `Runtime module "${slug}" không tồn tại trong registry.`,
    );
  }
}

if (errors.length > 0) {
  console.error(
    "\nExperiment validation FAILED\n",
  );

  for (
    const error of errors
  ) {
    console.error(
      `- ${error}`,
    );
  }

  console.error();

  process.exit(1);
}

const readyCount =
  registryEntries.filter(
    (entry) =>
      entry.status === "ready",
  ).length;

const plannedCount =
  registryEntries.filter(
    (entry) =>
      entry.status === "planned",
  ).length;

console.log(
  "Experiment validation PASSED",
);

console.log(
  `Registry: ${registryEntries.length} experiments`,
);

console.log(
  `Ready: ${readyCount}`,
);

console.log(
  `Planned: ${plannedCount}`,
);

console.log(
  `Runtime modules: ${runtimeSlugs.length}`,
);
