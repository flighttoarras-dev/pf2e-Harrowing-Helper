/**
 * bake-macros.cjs
 *
 * Copies each source/macros/*.js file into the "command" field of its
 * matching macro inside the plaintext JSON compendium source
 * (packs/_source/macros/*.json), keyed by macro name below.
 *
 * Mirrors bake-docs.cjs -- lets macro code be edited as plain, syntax
 * highlighted .js in VS Code instead of a single escaped JSON string, with
 * no manual hand-off through Foundry's macro editor required.
 *
 * Workflow:
 *   1. Edit source/macros/<name>.js
 *   2. node source/bake-macros.cjs
 *   3. npm run pack   (compiles packs/_source/macros -> packs/macros)
 */

const fs = require("fs");
const path = require("path");

const MACROS_DIR = path.join(__dirname, "macros");
const SOURCE_DIR = path.join(__dirname, "..", "packs", "_source", "macros");

// Maps macro "name" (in the JSON) -> source .js file (in source/macros/).
const MACRO_FILES = {
    "Harrowing": "harrowing.js",
    "Harrowing Apply Effects": "harrowing-apply-effects.js",
};

function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`No JSON source found at ${SOURCE_DIR}. Run "npm run unpack" first.`);
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".json"));
    const remaining = new Set(Object.keys(MACRO_FILES));

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        const doc = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const jsFile = MACRO_FILES[doc.name];
        if (!jsFile) continue;

        const jsPath = path.join(MACROS_DIR, jsFile);
        const code = fs.readFileSync(jsPath, "utf8").trim();

        doc.command = code;
        fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + "\n");
        console.log(`Updated "${doc.name}" in ${file} (${code.length} chars from ${jsFile})`);
        remaining.delete(doc.name);
    }

    if (remaining.size) {
        console.error(`Could not find a macro named ${[...remaining].map((n) => `"${n}"`).join(", ")} under ${SOURCE_DIR}.`);
        process.exit(1);
    }

    console.log('Done. Run "npm run pack" to compile the change into packs/macros.');
}

main();
