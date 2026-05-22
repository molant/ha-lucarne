interface CardElementConstructor {
  getConfigElement?: () => Promise<HTMLElement> | HTMLElement;
}

interface CardHelpers {
  createCardElement(config: { type: string; [k: string]: unknown }): Promise<HTMLElement> | HTMLElement;
}

type WindowWithHelpers = Window & typeof globalThis & {
  loadCardHelpers?: () => Promise<CardHelpers>;
};

const REQUIRED_ELEMENTS = ['ha-entity-picker', 'ha-textfield'] as const;
const WHEN_DEFINED_TIMEOUT_MS = 3000;

let pending: Promise<void> | undefined;

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function load(): Promise<void> {
  const loader = (window as WindowWithHelpers).loadCardHelpers;
  if (loader) {
    try {
      const helpers = await loader();
      // Create an entities card — but the editor-side components (ha-entity-picker,
      // ha-textfield) only register when the card's CONFIG ELEMENT is loaded, so
      // we force that too.
      const card = (await Promise.resolve(
        helpers.createCardElement({ type: 'entities', entities: [] }),
      )) as HTMLElement & { constructor: CardElementConstructor };
      const ctor = card.constructor;
      if (typeof ctor?.getConfigElement === 'function') {
        await Promise.resolve(ctor.getConfigElement());
      }
    } catch (err) {
      console.warn('[lucarne] loadCardHelpers failed; falling back to whenDefined', err);
    }
  }
  const ready: Promise<'ready'> = Promise.all(
    REQUIRED_ELEMENTS.map((name) => customElements.whenDefined(name)),
  ).then(() => 'ready' as const);
  const expired: Promise<'timeout'> = timeout(WHEN_DEFINED_TIMEOUT_MS).then(() => 'timeout' as const);
  const result = await Promise.race([ready, expired]);
  if (result === 'timeout' && !REQUIRED_ELEMENTS.every((name) => customElements.get(name))) {
    // Reject so callers (and the cached promise) don't treat half-loaded
    // state as success — `ensureHaFormElements` clears `pending` on rejection,
    // allowing a subsequent editor mount to retry.
    throw new Error('[lucarne] HA form elements did not register within timeout');
  }
}

export function ensureHaFormElements(): Promise<void> {
  if (!pending) {
    pending = load().catch((err) => {
      pending = undefined;
      throw err;
    });
  }
  return pending;
}
