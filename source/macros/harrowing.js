/*
Harrowing (PF2e) — v{{MODULE_VERSION}}

Requires:
- Advanced Macros
- Companion macro: Harrowing Apply Effects

See the Harrowing documentation journal for:
- Setup instructions
- Party configuration
- Gameplay notes
- Maintenance notes
- Troubleshooting
*/


/** =======================
 *  CONFIG / STORAGE
 *  ======================= 
*/ 

// Optional fixed caster Actor UUID. Leave "" to use the controlled token.
const FIXED_CASTER_ACTOR_UUID = "Actor.REPLACE_ME_CASTER"; // e.g. "Actor.XXXXXXXXXXXX"  (leave "" to use selected token)

// Suit IDs - This needs to run before the Party Set Up. Do not change.
const SUITS = {
  hammers: "hammers",
  keys: "keys",
  shields: "shields",
  books: "books",
  stars: "stars",
  crowns: "crowns",
};

// AoN suit numbers (Rituals: Harrowing) — use in preferenceList arrays below.
// 1=Hammers 2=Keys 3=Shields 4=Books 5=Stars 6=Crowns
const SUIT_BY_NUM = {
  1: SUITS.hammers,
  2: SUITS.keys,
  3: SUITS.shields,
  4: SUITS.books,
  5: SUITS.stars,
  6: SUITS.crowns,
};

// PARTY SET UP
// Key by persistent Actor UUID. Unlisted targets use FALLBACK_PREF.
// Used by "Party Member" and "Whole Party" modes. Strategy: "priority" or "spread".
// preferenceList: 1=Hammers 2=Keys 3=Shields 4=Books 5=Stars 6=Crowns
const TARGET_PREFS = {
  "Actor.REPLACE_ME_1": {
    name: "Slot 1",
    strategy: "priority",
    preferenceList: [1, 5, 4, 2, 3, 6],
  },
  "Actor.REPLACE_ME_2": {
    name: "Slot 2",
    strategy: "priority",
    preferenceList: [4, 6, 5, 1, 2, 3],
  },
  "Actor.REPLACE_ME_3": {
    name: "Slot 3",
    strategy: "spread",
    preferenceList: [5, 2, 3, 1, 4, 6],
  },
  "Actor.REPLACE_ME_4": {
    name: "Slot 4",
    strategy: "priority",
    preferenceList: [6, 4, 1, 5, 2, 3],
  },
  "Actor.REPLACE_ME_5": {
    name: "Slot 5",
    strategy: "spread",
    preferenceList: [1, 2, 3, 5, 4, 6],
  },
  "Actor.REPLACE_ME_6": {
    name: "Slot 6",
    strategy: "priority",
    preferenceList: [5, 3, 2, 1, 4, 6],
  },
  "Actor.REPLACE_ME_7": {
    name: "Slot 7",
    strategy: "spread",
    preferenceList: [2, 5, 1, 3, 4, 6],
  },
  "Actor.REPLACE_ME_8": {
    name: "Slot 8",
    strategy: "priority",
    preferenceList: [1, 2, 5, 3, 4, 6],
  },
  "Actor.REPLACE_ME_9": {
    name: "Slot 9",
    strategy: "priority",
    preferenceList: [1, 5, 4, 2, 3, 6],
  },
  "Actor.REPLACE_ME_10": {
    name: "Slot 10",
    strategy: "spread",
    preferenceList: [4, 6, 5, 1, 2, 3],
  },
  "Actor.REPLACE_ME_11": {
    name: "Slot 11",
    strategy: "priority",
    preferenceList: [5, 2, 3, 1, 4, 6],
  },
  "Actor.REPLACE_ME_12": {
    name: "Slot 12",
    strategy: "spread",
    preferenceList: [6, 4, 1, 5, 2, 3],
  },
  "Actor.REPLACE_ME_13": {
    name: "Slot 13",
    strategy: "priority",
    preferenceList: [1, 2, 3, 5, 4, 6],
  },
  "Actor.REPLACE_ME_14": {
    name: "Slot 14",
    strategy: "spread",
    preferenceList: [5, 3, 2, 1, 4, 6],
  },
  "Actor.REPLACE_ME_15": {
    name: "Slot 15",
    strategy: "priority",
    preferenceList: [2, 5, 1, 3, 4, 6],
  },
  "Actor.REPLACE_ME_16": {
    name: "Slot 16",
    strategy: "spread",
    preferenceList: [1, 2, 5, 3, 4, 6],
  },
  "Actor.REPLACE_ME_17": {
    name: "Slot 17",
    strategy: "priority",
    preferenceList: [5, 4, 6, 1, 2, 3],
  },
  "Actor.REPLACE_ME_18": {
    name: "Slot 18",
    strategy: "spread",
    preferenceList: [6, 5, 4, 1, 2, 3],
  },
  "Actor.REPLACE_ME_19": {
    name: "Slot 19",
    strategy: "priority",
    preferenceList: [4, 1, 5, 2, 3, 6],
  },
  "Actor.REPLACE_ME_20": {
    name: "Slot 20",
    strategy: "spread",
    preferenceList: [5, 2, 1, 4, 3, 6],
  },
};

// Party / time limits
const MAX_CASTS_PER_DAY_DEFAULT = 8; // 1 cast = 1 hour
const RITUAL_HOURS_PER_CAST = 1;

// Stable compendium UUID for Spell Effect: Harrowing
const HARROWING_EFFECT_UUID = "Compendium.pf2e.spell-effects.Item.LfxwvZRwtrh8mQN0";

// ===== Harrow check skill selection =====
// Modes: "highest" (default), "occultism", "fortune", "custom"
const HARROW_SKILL_MODE = "highest";

// Only used when HARROW_SKILL_MODE = "custom"
const HARROW_CUSTOM_SKILL_NAME = "Fortune-Telling Lore"; // example: "Fortune-Telling Lore", "Society", "Warfare Lore"

// Optional DC adjustment for the *per-card* Harrow checks.
// Default 0. Common table adjustments are -2 to -5 for lores, suggest -2 for Fortune Telling or Harrow Lore.
const HARROW_CHECK_DC_ADJUST = 0;

// Hide effect icons on tokens (effects still appear on the actor sheet).
const HIDE_TOKEN_EFFECT_ICONS = true;

// Chat output option: show the unchosen suit when Reading the Signs draws two suits.
const SHOW_OTHER_DRAW = false;

// Default apply mode in the Harrowing Setup dialog.
// Options: "target" (targeted token), "one" (party member), "party" (whole party)
const DEFAULT_APPLY_MODE = "target";

// Visual mapping: suit -> tint color in chat card output.
const SUIT_COLOR = {
  shields: "#4f83cc",
  hammers: "#c75b2a",
  books: "#d97706",
  keys: "#4f8f5f",
  stars: "#b388ff",
  crowns: "#c69214",
};

// Visual mapping: suit -> icon used on applied effects.
const SUIT_ICON = {
  shields: "systems/pf2e/icons/equipment/shields/specific-shields/reflecting-shield.webp",
  hammers: "systems/pf2e/icons/equipment/weapons/specific-magic-weapons/dwarven-thrower.webp",
  books: "systems/pf2e/icons/equipment/adventuring-gear/formula-book.webp",
  keys: "systems/pf2e/icons/equipment/held-items/key-steel-grey.webp",
  stars: "systems/pf2e/icons/spells/guiding-star.webp",
  crowns: "systems/pf2e/icons/equipment/worn-items/other-worn-items/crown-of-the-fire-eater.webp",
};

// Selector mapping for stock (non-Crowns) suit handling.
const SUIT_TO_SELECTOR_STOCK = {
  [SUITS.books]: "skill-check",
  [SUITS.crowns]: "perception",
  [SUITS.hammers]: "strike-attack-roll",
  [SUITS.keys]: "reflex",
  [SUITS.shields]: "fortitude",
  [SUITS.stars]: "will",
};

// Crowns custom selectors used when "harrowing-reroll" is toggled.
const CROWNS_SELECTORS = [
  "perception",
  "spell-attack-roll",
  "spell-attack",
  "flat-check",
  "recovery-check",
  "persistent-damage-recovery",
];

const FALLBACK_PREF = {
  name: "Default (unlisted target)",
  strategy: "spread",
  preferenceList: [1, 2, 3, 5, 4, 6],
};

// Standard DC by level table (PF2e)
const STANDARD_DC_BY_LEVEL = {
  0: 14,
  1: 15,
  2: 16,
  3: 18,
  4: 19,
  5: 20,
  6: 22,
  7: 23,
  8: 24,
  9: 26,
  10: 27,
  11: 28,
  12: 30,
  13: 31,
  14: 32,
  15: 34,
  16: 35,
  17: 36,
  18: 38,
  19: 39,
  20: 40,
};
const VERY_HARD_ADJUSTMENT = 5;

// Requires the companion macro "Harrowing Apply Effects"
// configured to Run for Specific User -> GM via Advanced Macros.
const applyMacro = game.macros.getName("Harrowing Apply Effects");
// Check for required Harrowing Apply Effects
if (!applyMacro) {
  throw new Error(
    'Required companion macro "Harrowing Apply Effects" was not found.'
  );
}

if (!game.modules.get("advanced-macros")?.active) {
  throw new Error("Advanced Macros is required.");
}
  
/** =======================
 *  INTERNAL HELPERS
 *  ======================= */

/* Notifications */

function getSingleTargetedToken() {
  const targets = [...game.user.targets];
  if (targets.length !== 1) return null;
  return targets[0];
}

function getActorLevel(actor) {
  return actor?.level ?? actor?.system?.details?.level?.value ?? 0;
}

/** Portable feat/item detection: check slug first, then exact name. */
function actorHasFeatLike(actor, { slug, name }) {
  return (
    actor?.items?.some(
      (i) =>
        i.type === "feat" &&
        ((slug && i.system?.slug === slug) || (name && i.name?.toLowerCase() === name.toLowerCase()))
    ) ?? false
  );
}

function actorHasItemLike(actor, { slug, nameIncludes = [] }) {
  const inc = nameIncludes.map((s) => s.toLowerCase());
  return (
    actor?.items?.some((i) => {
      if (slug && i.system?.slug === slug) return true;
      if (inc.length) {
        const n = (i.name ?? "").toLowerCase();
        return inc.every((part) => n.includes(part));
      }
      return false;
    }) ?? false
  );
}

/* Notifications */
function warn(msg) { ui.notifications.warn(msg); }
function error(msg) { ui.notifications.error(msg); }

/** Detect relevant caster feats/items for Harrowing automation. */
function detectCasterFeatures(casterActor) {
  return {
    hasThaumaturgicRitualist: actorHasFeatLike(casterActor, { slug: "thaumaturgic-ritualist", name: "Thaumaturgic Ritualist" }),
    hasHarrowRitualist: actorHasFeatLike(casterActor, { slug: "harrow-ritualist", name: "Harrow Ritualist" }),
    hasReadingTheSigns: actorHasFeatLike(casterActor, { slug: "reading-the-signs", name: "Reading the Signs" }),
    hasExperiencedHarrower: actorHasFeatLike(casterActor, { slug: "experienced-harrower", name: "Experienced Harrower" }),
    hasHarrowDeckFine: actorHasItemLike(casterActor, { nameIncludes: ["harrow deck", "fine"] }),
  };
}

/** Ritual DC = standard DC for level (2 * rank) + Very Hard (+5), unless Experienced Harrower. */
function computeHarrowingDC(ritualRank, casterFeatures) {
  const dcLevel = 2 * ritualRank; // rank 1-10 -> level 2-20
  const base = STANDARD_DC_BY_LEVEL[dcLevel];
  if (base == null) throw new Error(`No standard DC found for DC level ${dcLevel} (rank ${ritualRank}).`);
  const addVeryHard = casterFeatures.hasExperiencedHarrower ? 0 : VERY_HARD_ADJUSTMENT;
  return base + addVeryHard;
}

/** Cost: 20 gp * target level; free with Experienced Harrower + Harrow Deck (Fine). */
function computeHarrowingCost(targetActor, casterFeatures) {
  const targetLevel = Number(getActorLevel(targetActor) || 0);
  const gp = 20 * targetLevel;
  const isFree = casterFeatures.hasExperiencedHarrower && casterFeatures.hasHarrowDeckFine;
  return { targetLevel, gp: isFree ? 0 : gp, isFree };
}

function getActiveHarrowingSummary(actor) {
  const effects = (actor?.items ?? []).filter((i) => {
    if (i.type !== "effect") return false;

    // Detect any Harrowing effect (macro-tagged or manually named).
    const byFlags =
      i.flags?.world?.harrowingBatch === true &&
      i.flags?.world?.harrowingBatchSource === HARROWING_EFFECT_UUID;

    const byName = String(i.name ?? "").startsWith("Harrowing:");

    return byFlags || byName;
  });

  if (!effects.length) return "";

  const suits = effects
    .map((e) => e.name.replace("Harrowing:", "").trim())
    .map((s) => s.split("(")[0].trim())
    .filter(Boolean);

  const counts = {};
  for (const s of suits) {
    const key = s.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const parts = Object.entries(counts).map(([k, n]) => {
    const label = k.charAt(0).toUpperCase() + k.slice(1);
    return n > 1 ? `${label} x${n}` : label;
  });

  return ` (${parts.join(", ")})`;
}

/* Suit draw helpers */
function randomSuit() {
  const all = Object.values(SUITS);
  return all[Math.floor(Math.random() * all.length)];
}

/**
 * Returns a preference object for a target:
 * - strategy: "priority" or "spread"
 * - preferenceList: left-to-right priority list
 * Also ensures all suits appear at least once (missing suits appended).
 */
function getTargetPreference(targetActor) {
  const uuid = targetActor?.uuid;
  const pref = uuid && TARGET_PREFS[uuid] ? TARGET_PREFS[uuid] : FALLBACK_PREF;

  // Normalize numbers to suit strings (allows numeric preferenceList per AoN table).
  const normalized = pref.preferenceList.map(s => SUIT_BY_NUM[s] ?? s);

  // Ensure every suit appears at least once in the preference list.
  const allSuits = Object.values(SUITS);
  const seen = new Set(normalized);
  const fixed = normalized.slice();
  for (const s of allSuits) if (!seen.has(s)) fixed.push(s);

  return { ...pref, preferenceList: fixed };
}

/**
 * Reading the Signs suit selection:
 * - "priority": pick the higher-ranked suit from the two drawn.
 * - "spread": avoid repeats when possible, otherwise fall back to priority ranking.
 */
function pickSuitFromDraw(drawnSuits, prefList, strategy, alreadyChosenSet) {
  const rank = new Map(prefList.map((s, idx) => [s, idx]));
  const a = drawnSuits[0];
  const b = drawnSuits[1] ?? null;

  if (strategy === "spread") {
    const candidates = drawnSuits.filter((s) => !alreadyChosenSet.has(s));
    if (candidates.length === 1) return candidates[0];
    if (candidates.length === 2) {
      return (rank.get(candidates[0]) ?? 999) <= (rank.get(candidates[1]) ?? 999) ? candidates[0] : candidates[1];
    }
  }

  if (!b) return a;
  return (rank.get(a) ?? 999) <= (rank.get(b) ?? 999) ? a : b;
}

/* Degree-of-success helpers */
function degreeFromTotal(total, dc, die) {
  let degree;
  if (total >= dc + 10) degree = "criticalSuccess";
  else if (total >= dc) degree = "success";
  else if (total <= dc - 10) degree = "criticalFailure";
  else degree = "failure";

  // Apply nat-20 / nat-1 step adjustment only when die result is known.
  if (die === 20) {
    if (degree === "success") degree = "criticalSuccess";
    else if (degree === "failure") degree = "success";
    else if (degree === "criticalFailure") degree = "failure";
  } else if (die === 1) {
    if (degree === "success") degree = "failure";
    else if (degree === "criticalSuccess") degree = "success";
    else if (degree === "failure") degree = "criticalFailure";
  }

  return degree;
}

function bonusFromDegree(degree) {
  if (degree === "criticalSuccess") return 4;
  if (degree === "success") return 0;
  if (degree === "failure") return -4;
  return -4; // criticalFailure
}

/* Labels / display helpers */
function suitLabel(suit) {
  switch (suit) {
    case SUITS.hammers:
      return "Hammers";
    case SUITS.keys:
      return "Keys";
    case SUITS.shields:
      return "Shields";
    case SUITS.books:
      return "Books";
    case SUITS.stars:
      return "Stars";
    case SUITS.crowns:
      return "Crowns";
    default:
      return String(suit);
  }
}

function degreeColor(degree) {
  // Chat card colors for CS/S/F/CF labels.
  switch (degree) {
    case "criticalSuccess":
      return "#2e7d32"; // green
    case "success":
      return "#1565c0"; // blue
    case "failure":
      return "#ef6c00"; // orange
    default:
      return "#c62828"; // red (criticalFailure)
  }
}

/* Skill resolution */
function norm(s) {
  return (s ?? "").toString().trim().toLowerCase();
}

function getSkillModByQuery(actor, query) {
  const q = norm(query);
  if (!q) return null;

  // 1) Try actor.skills (most reliable in PF2e).
  const skillsObj = actor?.skills ?? actor?.system?.skills ?? {};
  const skills = Object.values(skillsObj).filter((v) => v && typeof v === "object");

  for (const s of skills) {
    const label = norm(s.label ?? s.name);
    const slug = norm(s.slug ?? s.key);
    if (!label) continue;

    // Exact match by label/slug.
    if (label === q || slug === q) return Number(s.mod ?? s.value?.mod ?? s.totalModifier ?? 0);

    // Partial match for labels like "Fortune-Telling Lore".
    if (label.includes(q)) return Number(s.mod ?? s.value?.mod ?? s.totalModifier ?? 0);
  }

  // 2) Fallback: lore items (for worlds that store lores as items).
  const loreItems = actor?.items?.filter((i) => i.type === "lore") ?? [];
  for (const li of loreItems) {
    const name = norm(li.name);
    const slug = norm(li.system?.slug);
    if (name === q || slug === q || name.includes(q)) {
      const mod = li.system?.mod ?? li.system?.value?.mod;
      if (Number.isFinite(mod)) return Number(mod);
    }
  }

  return null;
}

function getOccultismMod(actor) {
  return Number(actor?.skills?.occultism?.mod ?? actor?.system?.skills?.occ?.mod ?? actor?.system?.skills?.occultism?.mod ?? 0);
}

function resolveHarrowSkill(casterActor) {
  const occ = getOccultismMod(casterActor);
  const fortune =
    getSkillModByQuery(casterActor, "fortune") ??
    getSkillModByQuery(casterActor, "fortune-telling lore") ??
    getSkillModByQuery(casterActor, "fortune telling lore");

  if (HARROW_SKILL_MODE === "occultism") return { label: "Occultism", mod: occ };

  if (HARROW_SKILL_MODE === "fortune") {
    if (fortune == null) warn("Fortune-Telling Lore not found; using Occultism.");
    return { label: fortune == null ? "Occultism" : "Fortune-Telling Lore", mod: fortune ?? occ };
  }

  if (HARROW_SKILL_MODE === "custom") {
    const m = getSkillModByQuery(casterActor, HARROW_CUSTOM_SKILL_NAME);
    if (m == null) warn(`Custom skill not found ("${HARROW_CUSTOM_SKILL_NAME}"); using Occultism.`);
    return { label: m == null ? "Occultism" : HARROW_CUSTOM_SKILL_NAME, mod: m ?? occ };
  }

  // Default mode: use the higher of Fortune-Telling Lore and Occultism.
  const best = fortune != null && fortune > occ ? { label: "Fortune-Telling Lore", mod: fortune } : { label: "Occultism", mod: occ };

  return best;
}

/**
 * Rank selection dialog
 * - Auto-safe checkbox controls whether the rank input is enabled.
 * - Apply mode chooses targeted token, one party member, or whole party.
 */
async function promptRankWithAuto({ casterName, targetName, partySelectOptionsHtml, partyChecklistHtml, features, safeRank }) {
  const featLine = (label, has) =>
    `<div style="display:flex; justify-content:space-between; gap:0.75rem;">
      <span>${label}</span>
      <span>${has ? "✅" : "—"}</span>
    </div>`;

  const content = `
    <p><b>${casterName}</b> is performing a Harrowing on:</p>

    <div style="margin:0.25rem 0 0.5rem 0;">
      <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
        <input type="radio" name="applyMode" value="target" ${DEFAULT_APPLY_MODE === "target" ? "checked" : ""} />
        <span><b>Targeted Token:</b> ${targetName}</span>
      </label>

      <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
        <input type="radio" name="applyMode" value="one" ${DEFAULT_APPLY_MODE === "one" ? "checked" : ""} />
        <span><b>Party Member</b></span>
      </label>
      <div id="oneWrap" style="margin-left:1.25rem; display:none;">
        <select id="oneUuid" style="width:100%;">
          ${partySelectOptionsHtml}
        </select>
      </div>

      <label style="display:flex; align-items:center; gap:0.5rem;">
        <input type="radio" name="applyMode" value="party" ${DEFAULT_APPLY_MODE === "party" ? "checked" : ""} />
        <span><b>Whole Party</b></span>
      </label>
      <div id="partyWrap" style="margin-left:1.25rem; margin-top:0.35rem; display:none;">
        <div style="opacity:0.85; margin-bottom:0.25rem;">Uncheck to skip someone.</div>
        <div style="display:flex; flex-direction:column; gap:0.15rem; max-height:220px; overflow:auto; padding-right:0.25rem;">
          ${partyChecklistHtml}
        </div>
      </div>
    </div>

    <hr/>

    <div style="margin:0.25rem 0 0.5rem 0;">
      <label style="display:flex; align-items:center; gap:0.5rem;">
        <input type="checkbox" id="autoSafe" checked />
        <span>Auto-pick safe rank (nat 1 not a crit failure)</span>
      </label>
      <div style="margin-left:1.5rem; margin-top:0.15rem; font-size:0.9em; opacity:0.85;">Highest Safe Rank: <strong>${safeRank}</strong></div>
    </div>

    <div id="manualRankWrap" style="opacity:0.5;">
      <label>
        Ritual rank (1–10):
        <input id="ritualRank" type="number" min="1" max="10" value="1" style="width:100%; margin-top:0.25rem;" disabled />
      </label>
    </div>

    <div style="margin-top:0.5rem;">
      <label>
        Max casts today:
        <input id="maxCasts" type="number" min="1" max="99" value="${MAX_CASTS_PER_DAY_DEFAULT}" style="width:100%; margin-top:0.25rem;" />
      </label>
      <label style="display:flex; align-items:center; gap:0.5rem; margin-top:0.35rem;">
        <input type="checkbox" id="clearExisting" checked />
        <span>Clear existing Harrowing effects (required to re-apply)</span>
      </label>
    </div>

    <hr/>

    <div style="font-weight:600; margin-bottom:0.25rem;">Detected (informational)</div>
    <div style="display:flex; flex-direction:column; gap:0.15rem;">
      ${featLine(features.hasHarrowDeckFine ? "Experienced Harrower (DC Standard / -5, Cost Removed)" : "Experienced Harrower (DC Standard / -5, Cost Halved)", features.hasExperiencedHarrower)}
      ${featLine("Harrow Deck (Fine) (Removes Cost with Experienced Harrower)", features.hasHarrowDeckFine)}
      ${featLine("Thaumaturgic Ritualist (+2 circumstance)", features.hasThaumaturgicRitualist)}
      ${featLine("Harrow Ritualist (+2 status)", features.hasHarrowRitualist)}
      ${featLine("Reading the Signs (Draw 2 pick one / Preference Available)", features.hasReadingTheSigns)}
    </div>
  `;

  return await new Promise((resolve) => {
    new Dialog({
      width: 560,
      resizable: true,
      title: `Harrowing Ritual — Setup v${game.modules.get("harrowing-helper")?.version ?? "?"}`,
      content,
      buttons: {
        ok: {
          label: "OK",
          callback: (html) => {
            const auto = html.find("#autoSafe")[0]?.checked ?? true;
            const rank = Number(html.find("#ritualRank").val());
            const applyMode = html.find('input[name="applyMode"]:checked').val() ?? "target";
            const oneUuid = html.find("#oneUuid").val();
            const includeUuids = html.find(".partyCheck:checked").map((_, el) => el.value).get();
            const maxCasts = Number(html.find("#maxCasts").val()) || MAX_CASTS_PER_DAY_DEFAULT;
            const clearExisting = html.find("#clearExisting")[0]?.checked ?? true;

            resolve({ auto, rank, applyMode, oneUuid, includeUuids, maxCasts, clearExisting });
          },
        },
        cancel: { label: "Cancel", callback: () => resolve(null) },
      },
      default: "ok",
      render: (html) => {
        html.closest(".dialog").find(".dialog-content").css("overflow", "visible");
        const autoEl = html.find("#autoSafe");
        const wrap = html.find("#manualRankWrap");
        const rankEl = html.find("#ritualRank");

        const oneWrap = html.find("#oneWrap");
        const partyWrap = html.find("#partyWrap");
        const applyEls = html.find('input[name="applyMode"]');

        const syncApply = () => {
          const mode = html.find('input[name="applyMode"]:checked').val() ?? "target";
          oneWrap.css("display", mode === "one" ? "block" : "none");
          partyWrap.css("display", mode === "party" ? "block" : "none");
        };
        applyEls.on("change", syncApply);
        syncApply();

        const dlg = html.closest(".dialog");
        dlg.css("height", "auto"); // let window grow
        dlg.find(".dialog-content").css({ height: "auto", "max-height": "none", overflow: "visible" });
        dlg.closest(".window-app").find(".window-content").css({ height: "auto", "max-height": "none", overflow: "visible" });

        const syncRank = () => {
          const auto = autoEl[0]?.checked ?? true;
          wrap.css("opacity", auto ? "0.5" : "1");
          rankEl.prop("disabled", auto);
        };
        autoEl.on("change", syncRank);
        syncRank();
      },
    }).render(true);
  });
}

/**
 * Auto-safe rank selection
 * Guarantee: nat 1 cannot become a critical failure.
 * Implementation: nat1Total must be a SUCCESS before the nat-1 downgrade.
 */
function pickSafeRitualRank({ features, harrowSkill, bonusCirc, bonusStatus }) {
  const modTotal = Number(harrowSkill?.mod ?? 0) + Number(bonusCirc ?? 0) + Number(bonusStatus ?? 0);

  for (let rank = 10; rank >= 1; rank--) {
    const dc = computeHarrowingDC(rank, features) + (Number(HARROW_CHECK_DC_ADJUST) || 0);
    const nat1Total = 1 + modTotal;

    // Nat 1 always downgrades 1 step.
    // To GUARANTEE "no crit fail on nat 1", nat 1 must be at least a SUCCESS pre-downgrade.
    if (nat1Total >= dc) return rank;
  }
  return 1;
}

function formatSuitCompact(suit) {
  switch (suit) {
    case "shields":
      return "Shields (Fortitude)";
    case "keys":
      return "Keys (Reflex)";
    case "hammers":
      return "Hammers (Strikes)";
    case "books":
      return "Books (Skills)";
    case "stars":
      return "Stars (Will)";
    case "crowns":
      return "Crowns (flat/spell/perception)";
    default:
      return suit;
  }
}

async function getFixedCasterActor() {
  if (!FIXED_CASTER_ACTOR_UUID) return null;
  const a = await fromUuid(FIXED_CASTER_ACTOR_UUID);
  return a ?? null;
}

async function getCasterActorSmart() {
  const fixed = await getFixedCasterActor();
  if (fixed) return fixed;

  const token = canvas.tokens.controlled[0];
  return token?.actor ?? null;
}

// Party list source of truth for party-targeting UI.
function getPartyActorUuids() {
  return Object.keys(TARGET_PREFS).filter((u) => u?.startsWith("Actor."));
}

/** ===========================================================================================
 *  MAIN
 *  =========================================================================================== */

(async () => {
  const caster = await getCasterActorSmart();
  if (!caster) return warn("Select your caster token first.");

  const targetToken = getSingleTargetedToken();
  const targetActor = targetToken?.actor ?? null;
  const targetNameForDialog = targetActor?.name ?? "(no target selected)";

  // Build party dropdown/checklist options from TARGET_PREFS.
  const partyUuids = getPartyActorUuids();
  const partyActors = (await Promise.all(partyUuids.map((u) => fromUuid(u)))).filter(Boolean);

  const partySelectOptionsHtml = partyActors
    .map((a) => {
      const active = getActiveHarrowingSummary(a);
      return `<option value="${a.uuid}">${a.name}${active}</option>`;
    })
    .join("\n");

  const partyChecklistHtml = partyActors
    .map((a) => {
      const active = getActiveHarrowingSummary(a);
      return `
      <label style="display:flex; align-items:center; gap:0.5rem;">
        <input type="checkbox" class="partyCheck" value="${a.uuid}" checked />
        <span>${a.name}${active}</span>
      </label>`;
    })
    .join("");

  const features = detectCasterFeatures(caster);
  const harrowSkill = resolveHarrowSkill(caster);
  const occMod = harrowSkill.mod;
  const bonusCirc = features.hasThaumaturgicRitualist ? 2 : 0;
  const bonusStatus = features.hasHarrowRitualist ? 2 : 0;

  // Prompt setup choices (targets, rank mode, cast limit, clear-existing).
  const safeRank = pickSafeRitualRank({ features, harrowSkill, bonusCirc, bonusStatus });

  const rankChoice = await promptRankWithAuto({
    casterName: caster.name,
    targetName: targetNameForDialog,
    partySelectOptionsHtml,
    partyChecklistHtml,
    features,
    safeRank,
  });
  if (!rankChoice) return;

  const { auto, rank, applyMode, oneUuid, includeUuids, maxCasts, clearExisting } = rankChoice;
  let targetActors = [];

  if (applyMode === "party") {
    // Whole Party: include checked UUIDs only.
    const includeSet = new Set(includeUuids ?? []);
    targetActors = partyActors.filter((a) => includeSet.has(a.uuid));
  } else if (applyMode === "one") {
    // Party Member: use one selected UUID.
    const a = await fromUuid(oneUuid);
    if (a) targetActors = [a];
  } else {
    // Targeted Token: requires exactly one targeted token actor.
    if (!targetActor) {
      return warn("No valid targets selected. Target a token, pick a Party Member, or use Whole Party and check at least one target.");
    }
    targetActors = [targetActor];
  }

  if (!targetActors.length) return warn("No targets selected.");
  if (applyMode === "party" && (includeUuids?.length ?? 0) === 0) {
    return warn("No party members checked. Check at least one target.");
  }

  const allTargetResults = [];
  let totalCost = 0;

  // Enforce cast cap (1 cast per target).
  const maxCastsToday = Math.max(1, Number(maxCasts) || MAX_CASTS_PER_DAY_DEFAULT);
  if (targetActors.length > maxCastsToday) {
    const skipped = targetActors.length - maxCastsToday;
    warn(`Max casts today is ${maxCastsToday}. Skipping ${skipped} target(s).`);
    targetActors = targetActors.slice(0, maxCastsToday);
  }

  let ritualRank = rankChoice.auto
    ? pickSafeRitualRank({ caster, features, harrowSkill, bonusCirc, bonusStatus })
    : rankChoice.rank;

  if (!Number.isFinite(ritualRank) || ritualRank < 1 || ritualRank > 10) {
    return warn("Ritual rank must be between 1 and 10.");
  }

  const dc = computeHarrowingDC(ritualRank, features) + HARROW_CHECK_DC_ADJUST;

  const baseEffect = await fromUuid(HARROWING_EFFECT_UUID);
  if (!baseEffect) return error("Could not load Spell Effect: Harrowing from compendium.");

  for (const currentTarget of targetActors) {

    const pref = getTargetPreference(currentTarget);
    const draws = ritualRank;
    const targetActor = currentTarget;

    
    const cost = computeHarrowingCost(targetActor, features);
    totalCost += cost.gp;
    const alreadyChosen = new Set();
    const results = [];

    for (let i = 1; i <= draws; i++) {
      const roll = await new Roll(`1d20 + ${occMod} + ${bonusCirc} + ${bonusStatus}`).roll();
      const die =
        roll.terms?.find((t) => t.faces === 20)?.results?.[0]?.result ?? null;

      const total = Number(roll.total ?? 0);
      const totalMod = occMod + bonusCirc + bonusStatus;

      const degree = degreeFromTotal(total, dc, die);
      const degreeValue = bonusFromDegree(degree);

      let drawn = [randomSuit()];
      if (features.hasReadingTheSigns) drawn = [randomSuit(), randomSuit()];

      const chosenSuit = features.hasReadingTheSigns
        ? pickSuitFromDraw(drawn, pref.preferenceList, pref.strategy, alreadyChosen)
        : drawn[0];

      alreadyChosen.add(chosenSuit);

      results.push({
        index: i,
        die,
        totalMod,
        occultTotal: total,
        degree,
        degreeValue,
        drawnSuits: drawn.slice(),
        chosenSuit,
      });
    }

    // Build effect documents and preseed ChoiceSets to avoid prompts.
    const effectDocs = results.map((r, i) => {
      const data = baseEffect.toObject();
      const degreeValue = r.degreeValue;

      // Apply suit-specific icon.
      data.img = SUIT_ICON[r.chosenSuit] ?? data.img;

      data.flags ??= {};
      data.flags.pf2e ??= {};
      data.system ??= {};
      data.system.tokenIcon ??= {};
      data.system.tokenIcon.show = !HIDE_TOKEN_EFFECT_ICONS;
      data.system.rules ??= [];

      // Tag effects so this macro can detect/clear them on later runs.
      data.flags.world ??= {};
      data.flags.world.harrowingBatch = true;
      data.flags.world.harrowingBatchSource = HARROWING_EFFECT_UUID;

      // Helper: seed degree ChoiceSet with this card's value.
      const seedDegreeChoiceSet = (rules) =>
        rules.map((rule) => {
          if (rule?.key !== "ChoiceSet") return rule;
          if (rule.flag === "degreeOfSuccess") return { ...rule, selection: degreeValue };
          return rule;
        });

      // Non-Crowns: use stock suit ChoiceSet selector mapping.
      if (r.chosenSuit !== SUITS.crowns) {
        const selector = SUIT_TO_SELECTOR_STOCK[r.chosenSuit];

        data.flags.pf2e.rulesSelections = { degreeOfSuccess: degreeValue, suit: selector };

        data.system.rules = data.system.rules.map((rule) => {
          if (rule?.key !== "ChoiceSet") return rule;
          if (rule.flag === "degreeOfSuccess") return { ...rule, selection: degreeValue };
          if (rule.flag === "suit") return { ...rule, selection: selector };
          return rule;
        });

        data.name = `Harrowing: ${suitLabel(r.chosenSuit)}`;
        return data;
      }

      // Crowns: custom selectors (no stock suit ChoiceSet).
      data.name = `Harrowing: Crowns`;

      // Remove suit ChoiceSet and seed degree ChoiceSet.
      data.system.rules = seedDegreeChoiceSet(
        data.system.rules.filter((rule) => !(rule?.key === "ChoiceSet" && rule.flag === "suit"))
      );

      // Keep rulesSelections in sync for PF2e rule resolution.
      data.flags.pf2e.rulesSelections = { degreeOfSuccess: degreeValue };

      // Remove stock FlatModifier before adding custom Crowns modifiers.
      data.system.rules = data.system.rules.filter((rule) => rule?.key !== "FlatModifier");

      // Add multi-selector FlatModifiers for Crowns.
      for (const sel of CROWNS_SELECTORS) {
        data.system.rules.push({
          key: "FlatModifier",
          predicate: ["harrowing-reroll"],
          removeAfterRoll: "if-enabled",
          selector: sel,
          type: "status",
          value: "@item.flags.pf2e.rulesSelections.degreeOfSuccess",
        });
      }

      // Initiative modifier only when initiative uses Perception.
      data.system.rules.push({
        key: "FlatModifier",
        selector: "initiative",
        predicate: ["harrowing-reroll", "perception"], // only when initiative uses Perception
        removeAfterRoll: "if-enabled",
        type: "status",
        value: "@item.flags.pf2e.rulesSelections.degreeOfSuccess",
      });

      return data;
    });

    
    await applyMacro.execute({
    actorUuid: targetActor.uuid,
    clearExisting,
    effectDocs
    });
    
    allTargetResults.push({ actor: targetActor, results, cost });
  }

  // Build one summary chat card for the full run.

  const costText = totalCost === 0 ? "no cost" : `${totalCost} gp total`;
  const hoursSpent = (allTargetResults.length || 0) * RITUAL_HOURS_PER_CAST;
  const timeText = `${hoursSpent} hour${hoursSpent === 1 ? "" : "s"}`;

  const bonusParts = [];
  if (bonusCirc) bonusParts.push(`+${bonusCirc} circumstance`);
  if (bonusStatus) bonusParts.push(`+${bonusStatus} status`);
  const totalMod = occMod + bonusCirc + bonusStatus;
  const skillDisplay = bonusParts.length
    ? `${harrowSkill.label} (+${occMod} base, ${bonusParts.join(", ")} = +${totalMod} total)`
    : `${harrowSkill.label} (+${occMod})`;
  const headerLine = `<p><b>${caster.name}</b> performs a Harrowing (Rank ${ritualRank}, DC ${dc}) using ${skillDisplay} — ${costText} — ${timeText}.</p>`;

  const blocks = allTargetResults
    .map(({ actor, results }) => {
      const lines = results
        .map((r) => {
          const color = degreeColor(r.degree);
          const resultLabel =
            r.degree === "criticalSuccess"
              ? "CS"
              : r.degree === "success"
                ? "S"
                : r.degree === "failure"
                  ? "F"
                  : "CF";

          const drawnExtra =
            SHOW_OTHER_DRAW && features.hasReadingTheSigns
              ? (() => {
                  const otherSuit = r.drawnSuits.find((s) => s !== r.chosenSuit) ?? r.drawnSuits[1];
                  return `<br/><span style="opacity:0.85">Other draw: <span style="color:${SUIT_COLOR[otherSuit] ?? "inherit"};">${suitLabel(otherSuit)}</span></span>`;
                })()
              : "";

          return `
      <div style="margin: 0.15rem 0;">
        🂠 <span style="font-weight:600; color:${SUIT_COLOR[r.chosenSuit] ?? "inherit"};">${formatSuitCompact(r.chosenSuit)}</span>
        ${r.die}
        <span style="font-weight:700; color:${color};">${resultLabel}</span>
        ${drawnExtra}
      </div>
    `;
        })
        .join("");

      return `
    <div style="margin-top:0.5rem;">
      <div style="font-weight:700;">${actor.name}</div>
      ${lines}
    </div>
  `;
    })
    .join("");

  const content = `
  <div class="pf2e chat-card">
    ${headerLine}
    <hr/>
    ${blocks}
  </div>
`;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: caster }),
    content,
  });

  // Stock Spell Effect maps Crowns to perception only; this macro adds custom Crowns selectors above.
})().catch((e) => {
  console.error(e);
  ui.notifications.error(`Harrowing macro error: ${e?.message ?? e}`);
});
