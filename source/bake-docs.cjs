/**
 * bake-docs.cjs
 * Reads source/documentation.html and writes its content into the documentation LDB.
 *
 * Usage:
 *   node source/bake-docs.cjs <path-to-local-docs-db>
 *
 * The docs LDB must be on a local drive (not a mapped network drive).
 * Typical workflow:
 *   1. Copy packs/documentation to a local scratch path and fix CURRENT line endings.
 *   2. Run this script against that local copy.
 *   3. Copy the updated LDB back to packs/documentation.
 */

const { ClassicLevel } = require("classic-level");
const fs = require("fs");
const path = require("path");

const DOC_PAGE_KEY = "!journal.pages!D0ap8pT27lbjl9tI.Pf68aWJ4dVWUWYLq";
const HTML_FILE = path.join(__dirname, "documentation.html");

async function main() {
    const dbPath = process.argv[2];
    if (!dbPath) {
        console.error("Usage: node bake-docs.cjs <path-to-docs-db>");
        process.exit(1);
    }

    const html = fs.readFileSync(HTML_FILE, "utf8").trim();
    console.log(`Read documentation.html (${html.length} chars)`);

    const db = new ClassicLevel(dbPath, { keyEncoding: "utf8", valueEncoding: "utf8" });
    await db.open();

    const raw = await db.get(DOC_PAGE_KEY);
    const doc = JSON.parse(raw);
    doc.text.content = html;
    await db.put(DOC_PAGE_KEY, JSON.stringify(doc));

    await db.close();
    console.log("Documentation baked successfully.");
}

main().catch(console.error);
