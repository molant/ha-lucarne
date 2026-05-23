import { Window } from 'happy-dom';

const win = new Window({ url: 'http://localhost/' });

// Expose all happy-dom Window properties as globals so Lit can access them.
// We skip properties already defined on globalThis to avoid clobbering Node builtins,
// EXCEPT for DOM constructors/APIs that must point to happy-dom instances so that
// happy-dom's EventTarget.dispatchEvent instanceof checks pass.
const alwaysOverride = new Set([
  'window', 'document', 'customElements',
  'Event', 'CustomEvent', 'EventTarget',
  'HTMLElement', 'Element', 'Node', 'ShadowRoot',
  'CSSStyleSheet', 'MutationObserver',
]);

for (const key of Object.getOwnPropertyNames(win)) {
  if (!alwaysOverride.has(key) && key in globalThis) continue;
  try {
    Object.defineProperty(globalThis, key, {
      value: win[key],
      writable: true,
      configurable: true,
    });
  } catch {
    // Some descriptors are non-configurable; skip them
  }
}

// Ensure window itself points to the happy-dom instance
Object.defineProperty(globalThis, 'window', { value: win, writable: true, configurable: true });
