/**
 * scripts/packs.mjs
 *
 * Converts between compiled Foundry VTT compendium packs (LevelDB, in packs/<name>/)
 * and their plaintext JSON source (in packs/_source/<name>/*.json).
 *
 * Usage:
 *   node scripts/packs.mjs unpack   # LevelDB -> JSON  (run after editing packs in Foundry)
 *   node scripts/packs.mjs pack     # JSON -> LevelDB   (run before loading the module in Foundry / before release)
 *
 * Pack definitions are read straight from module.json, so adding/removing a
 * compendium there is all that's needed to pick it up here too.
 *
 * Version stamping: any string field in the JSON source (macro `command`
 * text, journal page HTML, etc.) containing the literal placeholder
 * "{{MODULE_VERSION}}" gets that placeholder replaced with the current
 * module.json "version" value whenever `pack` runs. This means macros/docs
 * never need their embedded "vX.Y.Z" text hand-edited - bump the version in
 * module.json (or let the release workflow do it) and run `npm run pack`.
 * The placeholder is only replaced in the compiled LevelDB output; the
 * checked-in JSON source keeps the literal placeholder.
 */

import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "packs", "_source");
const VERSION_PLACEHOLDER = "{{MODULE_VERSION}}";

async function loadModuleJson() {
    return JSON.parse(await fs.readFile(path.join(ROOT, "module.json"), "utf8"));
}

async function loadPacks() {
    const moduleJson = await loadModuleJson();
    if (!Array.isArray(moduleJson.packs) || moduleJson.packs.length === 0) {
        throw new Error("No packs found in module.json");
    }
    return moduleJson.packs.map((p) => ({
        name: p.name,
        compiledDir: path.join(ROOT, p.path),
        sourceDir: path.join(SOURCE_ROOT, p.name),
    }));
}

async function pathExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

// Best-effort wipe of a directory before a fresh rebuild, so documents
// removed/renamed on one side don't linger as orphans on the other. This is
// skipped (with a warning) if the filesystem refuses the delete - e.g. some
// sandboxed/managed environments block deleting existing files - in which
// case extractPack/compilePack simply upsert into the existing directory.
async function tryClean(dir) {
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch (err) {
        console.warn(`Could not clean ${path.basename(dir)} (${err.code ?? err.message}); updating in place instead.`);
    }
    await fs.mkdir(dir, { recursive: true });
}

// Recursively replaces VERSION_PLACEHOLDER in every string field of a
// document (in place), so it works regardless of which field a given
// document type stores its text in (macro `command`, journal page
// `text.content`, etc.).
function stampVersion(node, version) {
    if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
            if (typeof node[i] === "string") {
                if (node[i].includes(VERSION_PLACEHOLDER)) node[i] = node[i].split(VERSION_PLACEHOLDER).join(version);
            } else if (node[i] && typeof node[i] === "object") {
                stampVersion(node[i], version);
            }
        }
    } else if (node && typeof node === "object") {
        for (const key of Object.keys(node)) {
            const val = node[key];
            if (typeof val === "string") {
                if (val.includes(VERSION_PLACEHOLDER)) node[key] = val.split(VERSION_PLACEHOLDER).join(version);
            } else if (val && typeof val === "object") {
                stampVersion(val, version);
            }
        }
    }
}

async function unpack() {
    const packs = await loadPacks();
    for (const pack of packs) {
        if (!(await pathExists(pack.compiledDir))) {
            console.warn(`Skipping "${pack.name}": no compiled pack at ${pack.compiledDir}`);
            continue;
        }
        await tryClean(pack.sourceDir);

        console.log(`Unpacking "${pack.name}" -> ${path.relative(ROOT, pack.sourceDir)}`);
        await extractPack(pack.compiledDir, pack.sourceDir, { log: true });
    }
}

async function pack() {
    const moduleJson = await loadModuleJson();
    const version = moduleJson.version;
    const packs = await loadPacks();
    for (const pack of packs) {
        if (!(await pathExists(pack.sourceDir))) {
            console.warn(`Skipping "${pack.name}": no JSON source at ${pack.sourceDir}`);
            continue;
        }
        await tryClean(pack.compiledDir);

        console.log(`Packing "${pack.name}" -> ${path.relative(ROOT, pack.compiledDir)} (version ${version})`);
        await compilePack(pack.sourceDir, pack.compiledDir, {
            log: true,
            transformEntry: (entry) => {
                stampVersion(entry, version);
            },
        });
    }
}

async function main() {
    const mode = process.argv[2];
    if (mode === "unpack") {
        await unpack();
    } else if (mode === "pack") {
        await pack();
    } else {
        console.error("Usage: node scripts/packs.mjs <unpack|pack>");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
