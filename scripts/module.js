Hooks.once("ready", async () => {
    if (!game.user.isGM) return;
    const mac = game.macros.getName("Harrowing Apply Effects");
    if (!mac) {
        console.warn("Harrowing Helper | Harrowing Apply Effects macro not found in world.");
        return;
    }
    const updates = {};
    if (mac.author?.id !== game.user.id) updates.author = game.user.id;
    if ((mac.ownership?.default ?? 3) !== 2) updates.ownership = { default: 2 };
    if (!mac.getFlag("advanced-macros", "runForSpecificUser"))
        updates["flags.advanced-macros.runForSpecificUser"] = "GM";
    if (Object.keys(updates).length) {
        console.log("Harrowing Helper | Configuring HAE macro:", updates);
        await mac.update(updates);
        console.log("Harrowing Helper | HAE macro configured successfully.");
    } else {
        console.log("Harrowing Helper | HAE macro already configured correctly.");
    }
});

// =============================================================================
// Harrow reroll availability badge
//
// Keep these four constants in sync with source/macros/harrowing.js -- they
// are duplicated here because macro `command` text and this persistent
// script can't share an import. This is the only place the module runs
// logic that isn't the one-time HAE permission fix above.
// =============================================================================

const HARROWING_EFFECT_UUID = "Compendium.pf2e.spell-effects.Item.LfxwvZRwtrh8mQN0";

const SUIT_LABELS = {
    hammers: "Hammers",
    keys: "Keys",
    shields: "Shields",
    books: "Books",
    stars: "Stars",
    crowns: "Crowns",
};

const SUIT_COLOR = {
    shields: "#4f83cc",
    hammers: "#c75b2a",
    books: "#d97706",
    keys: "#4f8f5f",
    stars: "#b388ff",
    crowns: "#c69214",
};

const SUIT_TO_SELECTOR_STOCK = {
    books: "skill-check",
    crowns: "perception",
    hammers: "strike-attack-roll",
    keys: "reflex",
    shields: "fortitude",
    stars: "will",
};

const CROWNS_SELECTORS = [
    "perception",
    "spell-attack-roll",
    "spell-attack",
    "flat-check",
    "recovery-check",
    "persistent-damage-recovery",
];

// Font Awesome is bundled with Foundry itself; PF2e's own reroll icons
// (hero point, mythic point in check.ts) use this same fontAwesomeIcon
// pattern, so no new image assets are needed for the suit symbols.
const SUIT_ICON_CLASS = {
    hammers: "fa-hammer",
    keys: "fa-key",
    shields: "fa-shield",
    books: "fa-book",
    stars: "fa-star",
    crowns: "fa-crown",
};

/**
 * Unused Harrowing effects on an actor, resolved to a suit key from the
 * effect's name, plus the degree of success (+4/0/-4) baked into it at cast
 * time -- see harrowing.js's `bonusFromDegree`. This value never changes
 * after the fact, so a -4 effect will always worsen whatever it's used on.
 */
function getAvailableHarrowingSuits(actor) {
    if (!actor) return [];
    return (actor.items ?? [])
        .filter(
            (i) =>
                i.type === "effect" &&
                i.flags?.world?.harrowingBatch === true &&
                i.flags?.world?.harrowingBatchSource === HARROWING_EFFECT_UUID,
        )
        .map((i) => {
            const label = String(i.name ?? "")
                .replace("Harrowing:", "")
                .split("(")[0]
                .trim();
            const suit = Object.entries(SUIT_LABELS).find(([, l]) => l === label)?.[0];
            if (!suit) return null;
            const degree = i.flags?.pf2e?.rulesSelections?.degreeOfSuccess ?? 0;
            return { suit, effectId: i.id, degree };
        })
        .filter((s) => s !== null);
}

/** Does this suit's reroll selector appear among the roll's domains? */
function suitMatchesRollDomains(suit, domains) {
    if (suit === "crowns") return CROWNS_SELECTORS.some((sel) => domains.includes(sel));
    const selector = SUIT_TO_SELECTOR_STOCK[suit];
    return !!selector && domains.includes(selector);
}

/**
 * Per-degree badge styling. Deliberately not color-only, for colorblind
 * players: each tier is also distinguished by border presence/pattern and
 * brightness, so the three are still distinct with zero color perception.
 *   - Success (0): plain icon, no border -- the baseline/common case.
 *   - Critical Success (+4): solid glowing ring, full brightness.
 *   - Failure (-4): dashed border, dimmed/desaturated. There is no
 *     Critical Failure case -- the macro's auto-safe-rank picker guarantees
 *     a nat 1 can't produce one -- but plain Failure still gives the same
 *     -4 as a crit failure would, so it still needs the "avoid" treatment.
 */
function badgeStyleForDegree(degree) {
    if (degree > 0) {
        return {
            border: "2px solid #f2c94c",
            boxShadow: "0 0 4px 1px #f2c94c",
            opacity: "1",
            filter: "none",
        };
    }
    if (degree < 0) {
        return {
            border: "1px dashed #c0392b",
            boxShadow: "none",
            opacity: "0.55",
            filter: "grayscale(70%)",
        };
    }
    return { border: "none", boxShadow: "none", opacity: "1", filter: "none" };
}

function degreeLabel(degree) {
    if (degree > 0) return "Critical Success";
    if (degree < 0) return "Failure -- use with caution";
    return "Success";
}

/**
 * Pull the specific statistic slug (e.g. "will", "diplomacy", "perception")
 * the original roll used out of `check:statistic:<slug>` in context.options,
 * ignoring the separate `check:statistic:base:<slug>` entry. This lets a
 * generic domain like "skill-check" (Books) resolve to the exact skill that
 * was actually rolled, rather than just "some skill."
 */
function getStatisticSlugFromContext(context) {
    const match = (context?.options ?? []).find(
        (o) => o.startsWith("check:statistic:") && !o.startsWith("check:statistic:base:"),
    );
    return match ? match.slice("check:statistic:".length) : null;
}

/**
 * Best-effort match of the original Strike + MAP variant from the roll
 * context, for the Hammers suit. UNCONFIRMED against a live attack roll --
 * unlike the Statistic path (getStatisticSlugFromContext, confirmed via
 * check:statistic:* roll options), I don't yet know the exact shape
 * PF2e uses to identify "which strike, which variant" on a chat message's
 * context. This tries context.identifier first (seen elsewhere formatted
 * as "<something>.<mapIndex>"), then falls back to the first strike with
 * an unused variant. Expect this specifically may need adjustment after
 * a live test -- flag it if the wrong weapon or MAP level rerolls.
 */
function findStrikeAndVariant(actor, context) {
    const identifier = context?.identifier ?? "";
    const mapMatch = identifier.match(/\.(\d+)$/);
    const variantIndex = mapMatch ? Number(mapMatch[1]) : 0;

    const strikes = actor?.system?.actions ?? [];
    const bySlug = identifier ? strikes.find((a) => identifier.includes(a.slug)) : null;
    const strike = bySlug ?? strikes[0] ?? null;

    return strike ? { strike, variantIndex: Math.min(variantIndex, strike.variants.length - 1) } : null;
}

/**
 * Re-invoke the actual roll (Statistic for saves/skills/perception, Strike
 * variant for Hammers) with the harrowing-reroll option forced in, so the
 * effect's FlatModifier applies to a fresh roll rather than a clone of the
 * old one. Re-uses the real dialog and the real game math -- see the
 * conversation history for why a hand-rolled clone+adjust was rejected.
 *
 * `isReroll: true` in the args is a best-effort attempt to mark the result
 * non-rerollable (mirrors CheckRoll.isReroll / message.isRerollable in
 * PF2e's own roll.ts), so a hero point/mythic point can't be stacked on top
 * of this reroll afterward. UNCONFIRMED whether Statistic/Strike roll()
 * actually threads an arbitrary `isReroll` arg through to the resulting
 * roll's options -- this is the least certain part of this feature.
 *
 * Returns true only if a roll actually completed and the effect was
 * consumed -- false for "cancelled dialog" or "couldn't find what to roll",
 * neither of which should be treated as a used charge.
 */
async function useHarrowingReroll(actor, effectId, suit, context) {
    const effect = actor.items.get(effectId);
    if (!effect) {
        ui.notifications.warn("That Harrowing reroll has already been used.");
        return false;
    }

    const rollArgs = { extraRollOptions: ["harrowing-reroll"], isReroll: true };
    if (context?.dc) rollArgs.dc = context.dc;

    let result = null;
    if (suit === "hammers") {
        const found = findStrikeAndVariant(actor, context);
        if (!found) {
            ui.notifications.warn("Couldn't find a matching Strike to reroll.");
            return false;
        }
        result = await found.strike.variants[found.variantIndex].roll(rollArgs);
    } else {
        const slug = getStatisticSlugFromContext(context);
        const statistic = slug ? actor.getStatistic(slug) : null;
        if (!statistic) {
            ui.notifications.warn("Couldn't determine which statistic to reroll.");
            return false;
        }
        result = await statistic.check.roll(rollArgs);
    }

    // A null/undefined result means the player cancelled the roll dialog --
    // don't consume the effect in that case.
    if (!result) return false;

    await actor.deleteEmbeddedDocuments("Item", [effectId]);
    return true;
}

// `context.domains` holds the roll's bare selector strings (e.g. "will",
// "saving-throw") -- the same list a FlatModifier's `selector` field matches
// against. `context.options` is namespaced ("save:will:rank:0") and never
// contains the bare selector, so it can't be used for this check. Confirmed
// 2026-07-22 via a live Will save: domains: ["will", "wis-based",
// "saving-throw", "all", "check", "will-check"].
Hooks.on("renderChatMessageHTML", (message, html) => {
    try {
        if (html.dataset.harrowingBadged) return;

        const context = message.flags?.pf2e?.context;
        const domains = context?.domains;
        if (!message.isContentVisible || !Array.isArray(domains)) return;

        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if (!actor || !(game.user.isGM || actor.isOwner)) return;

        const matches = getAvailableHarrowingSuits(actor).filter((s) => suitMatchesRollDomains(s.suit, domains));
        if (!matches.length) return;

        html.dataset.harrowingBadged = "true";

        // Inserted as its own row *after* the header entirely, rather than
        // appended inside it: the roll-type flavor text is itself the last
        // grid row inside header.message-header's own CSS grid, so a plain
        // appended child there gets auto-placed by the grid and can overlap
        // that text instead of sitting below it.
        const header = html.querySelector("header.message-header");
        const row = document.createElement("div");
        row.className = "harrowing-badge-row";
        row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35em;margin:0.15em 0 0.35em 0;";

        for (const { suit, effectId, degree } of matches) {
            const style = badgeStyleForDegree(degree);
            const badge = document.createElement("span");
            badge.className = "harrowing-reroll-badge";
            badge.dataset.effectId = effectId;
            badge.dataset.suit = suit;
            badge.dataset.degree = String(degree);
            badge.dataset.tooltip = `Harrowing (${SUIT_LABELS[suit]}) reroll available -- ${degreeLabel(degree)}`;
            badge.style.cssText = [
                "display:inline-flex",
                "align-items:center",
                "justify-content:center",
                "width:1.4em",
                "height:1.4em",
                "border-radius:50%",
                "background:rgba(0,0,0,0.08)",
                `border:${style.border}`,
                `box-shadow:${style.boxShadow}`,
                `opacity:${style.opacity}`,
                `filter:${style.filter}`,
            ].join(";");

            const icon = document.createElement("i");
            icon.className = `fa-solid ${SUIT_ICON_CLASS[suit]}`;
            icon.style.color = SUIT_COLOR[suit];
            icon.style.fontSize = "0.85em";

            badge.appendChild(icon);

            // Only the actor's owner (or GM) can actually spend the reroll --
            // everyone else who can see this message (per the isOwner gate
            // above being GM-or-owner-only, this is currently always true,
            // but kept explicit in case that gate ever loosens).
            if (game.user.isGM || actor.isOwner) {
                badge.style.cursor = "pointer";
                badge.addEventListener("click", async (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    // Guards against double-clicks while the roll dialog is open,
                    // not a "permanently used" flag -- only a true result below
                    // (an actually-completed reroll) locks the badge for good.
                    if (badge.dataset.harrowingBusy) return;
                    badge.dataset.harrowingBusy = "true";
                    try {
                        const used = await useHarrowingReroll(actor, effectId, suit, context);
                        if (used) {
                            // Dim the clicked badge in place as immediate feedback --
                            // the actual reroll result posts as its own new message.
                            badge.style.opacity = "0.35";
                            badge.style.cursor = "default";
                        }
                    } catch (err) {
                        console.warn("Harrowing Helper | reroll failed:", err);
                        ui.notifications.error("Harrowing reroll failed -- see console for details.");
                    } finally {
                        delete badge.dataset.harrowingBusy;
                    }
                });
            }

            row.appendChild(badge);
        }

        if (header) {
            header.insertAdjacentElement("afterend", row);
        } else {
            html.prepend(row);
        }
    } catch (err) {
        console.warn("Harrowing Helper | reroll-availability badge failed:", err);
    }
});
