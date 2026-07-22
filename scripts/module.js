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

/** Unused Harrowing effects on an actor, resolved to a suit key from the effect's name. */
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
            return suit ? { suit, effectId: i.id } : null;
        })
        .filter((s) => s !== null);
}

/** Does this suit's reroll selector appear among the roll's active options? */
function suitMatchesRollOptions(suit, rollOptions) {
    if (suit === "crowns") return CROWNS_SELECTORS.some((sel) => rollOptions.includes(sel));
    const selector = SUIT_TO_SELECTOR_STOCK[suit];
    return !!selector && rollOptions.includes(selector);
}

// NOTE: unverified against a live chat message -- `context.options` is assumed to
// contain the roll's selector strings (the same options PF2e's own predicated rule
// elements match against). If the badge never appears on a matching roll, check
// this assumption first via `game.messages.contents.at(-1).flags.pf2e.context` in
// the console.
Hooks.on("renderChatMessageHTML", (message, html) => {
    try {
        if (html.dataset.harrowingBadged) return;

        const context = message.flags?.pf2e?.context;
        const rollOptions = context?.options;
        if (!message.isContentVisible || !Array.isArray(rollOptions)) return;

        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if (!actor || !(game.user.isGM || actor.isOwner)) return;

        const matches = getAvailableHarrowingSuits(actor).filter((s) => suitMatchesRollOptions(s.suit, rollOptions));
        if (!matches.length) return;

        html.dataset.harrowingBadged = "true";
        const header = html.querySelector("header.message-header") ?? html;
        for (const { suit } of matches) {
            const badge = document.createElement("span");
            badge.className = "harrowing-reroll-badge";
            badge.dataset.tooltip = `Harrowing (${SUIT_LABELS[suit]}) reroll available`;
            badge.style.cssText = [
                "display:inline-flex",
                "align-items:center",
                "justify-content:center",
                "width:1.1em",
                "height:1.1em",
                "margin-left:0.35em",
                "border-radius:50%",
                `background:${SUIT_COLOR[suit]}`,
            ].join(";");
            header.appendChild(badge);
        }
    } catch (err) {
        console.warn("Harrowing Helper | reroll-availability badge failed:", err);
    }
});
