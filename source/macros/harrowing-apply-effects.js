// Harrowing Apply Effects — v{{MODULE_VERSION}}
// Requires Advanced Macros.
// Configured automatically by the module on world load.
//
// Scope:
// {
//   actorUuid,
//   clearExisting,
//   effectDocs
// }

// Stable compendium UUID for Spell Effect: Harrowing
const HARROWING_EFFECT_UUID = "Compendium.pf2e.spell-effects.Item.LfxwvZRwtrh8mQN0";

const targetActor = await fromUuid(scope.actorUuid);

const clearExisting = scope.clearExisting;
const effectDocs = scope.effectDocs;



// Helper Functions

function hasAnyHarrowingEffect(targetActor) {
  return (
    targetActor?.items?.some(
      (i) =>
        i.type === "effect" &&
        i.flags?.world?.harrowingBatch === true &&
        i.flags?.world?.harrowingBatchSource === HARROWING_EFFECT_UUID
    ) ?? false
  );
}


if (clearExisting) {
      const toDelete = (targetActor.items ?? [])
        .filter(
          (i) =>
            i.type === "effect" &&
            i.flags?.world?.harrowingBatch === true &&
            i.flags?.world?.harrowingBatchSource === HARROWING_EFFECT_UUID
        )
        .map((i) => i.id);

      if (toDelete.length) await targetActor.deleteEmbeddedDocuments("Item", toDelete);
    } else {
      // If not clearing, skip actors that already have Harrowing active.
      if (hasAnyHarrowingEffect(targetActor)) {
        throw new Error(
          `${targetActor.name} already has Harrowing active. Enable "Clear existing" or uncheck them.`
                        );
      }
    }

    // Apply new effects for this target.
    await targetActor.createEmbeddedDocuments("Item", effectDocs);
    if (typeof targetActor?.reset === "function") await targetActor.reset();
