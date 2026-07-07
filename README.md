# Harrowing Helper

A [Foundry VTT](https://foundryvtt.com/) module for Pathfinder 2e that automates the [Harrowing ritual](https://2e.aonprd.com/Rituals.aspx?ID=100).

So your GM let you run a Harrowing build? You don't want to spend the entire session rolling ritual checks and applying effects? Now you can have the AWESOME power of HARROWING RITUAL with all of the boring stuff automated.

---

## Features

- Rolls all Harrow checks automatically and resolves degrees of success
- Detects relevant feats and items on the caster (Experienced Harrower, Harrow Ritualist, Thaumaturgic Ritualist, Reading the Signs, Fine Harrow Deck)
- Handles Reading the Signs two-card draws with configurable suit preference strategies per party member
- Applies Harrowing effects directly to target actors — including actors not owned by the player running the ritual
- Supports a single target, a selected party member, or your entire configured party in one cast
- Posts a consolidated chat summary showing every draw, check result, and applied suit
- Clears existing Harrowing effects before reapplying (configurable)

---

## Requirements

| Dependency | Version |
|---|---|
| Foundry VTT | v13+ |
| PF2e System | v7.8+ |
| [Advanced Macros](https://foundryvtt.com/packages/advanced-macros) | v2.3+ |

---

## Installation

**Method 1 — Foundry Module Browser**
Search for **Harrowing Helper** in the Foundry module browser and install directly.

**Method 2 — Manifest URL**
Paste the manifest URL into Foundry's **Install Module** dialog:

```
https://raw.githubusercontent.com/flighttoarras-dev/pf2e-Harrowing-Helper/main/module.json
```

---

## Setup

1. Enable the module and the **Advanced Macros** module in your world.
2. Import both macros from the **Harrowing Helper — Macros** compendium into your world.
3. Set **Harrowing Apply Effects** to **Observer** permission (right-click → Configure → Default Ownership: Observer). The module maintains this automatically on subsequent world loads.
4. Configure your party in the `TARGET_PREFS` section of the **Harrowing** macro — add each actor's UUID and their suit preference list using numbers 1–6:

| # | Suit | Associated Check |
|---|---|---|
| 1 | Hammers | Strikes |
| 2 | Keys | Reflex saves |
| 3 | Shields | Fortitude saves |
| 4 | Books | Skill checks |
| 5 | Stars | Will saves |
| 6 | Crowns | All other checks |

> **Note:** A GM must be logged in for the macro to function. The macro routes effect application through the GM to handle actors not owned by the casting player.

Full setup and configuration details are in the **Harrowing Helper — Documentation** journal included with the module.

---

## Usage

1. Select your caster token (or configure a fixed caster UUID).
2. Target the intended recipient token (for single-target mode).
3. Run the **Harrowing** macro.
4. Configure the setup dialog — apply mode, rank, cast limit — and click OK.
5. The macro rolls all checks, draws suits, applies effects, and posts a chat summary.

---

## Compatibility

| Version | Notes |
|---|---|
| 1.0.11 | Current release |
| Foundry v13 | Verified |
| PF2e v7.8+ | Verified |

---

## License

This module is provided for free use. See [LICENSE](LICENSE) for details.

## Author

[Flighttoarras](https://github.com/flighttoarras-dev)
