// Forces HA's edit-dialog card preview to render at full pane width by overriding
// the grid container's --grid-column-count. Scoped to the editor preview only —
// real dashboards sit outside any hui-dialog-edit-card / ha-dialog ancestor.

export interface PreviewOverrideHandle {
  uninstall(): void;
}

function isInEditorPreview(host: Element): boolean {
  // closest() stops at shadow boundaries, but ha-dialog lives in a sibling shadow
  // tree from where our cards render. Walk up manually, hopping via getRootNode().
  let node: Node | null = host;
  while (node) {
    if (node instanceof Element) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'hui-dialog-edit-card' || tag === 'ha-dialog') return true;
    }
    const parent: Node | null = (node as Element).parentNode;
    if (parent) {
      node = parent;
      continue;
    }
    const root = node.getRootNode();
    node = root instanceof ShadowRoot ? root.host : null;
  }
  return false;
}

function findGridContainer(host: Element): HTMLElement | null {
  // The HA wrapper structure is:
  //   ha-sortable > div.container > div.card[style="--column-size: N"] > <our-card>
  // We want the .container (parent of .card) so we can override --grid-column-count.
  let cardEl: HTMLElement | null = host.parentElement;
  while (cardEl && !cardEl.style.getPropertyValue('--column-size')) {
    cardEl = cardEl.parentElement;
  }
  return cardEl?.parentElement ?? null;
}

export function installPreviewColumnOverride(host: HTMLElement): PreviewOverrideHandle | null {
  if (!isInEditorPreview(host)) return null;
  const container = findGridContainer(host);
  if (!container) return null;

  const previous = container.style.getPropertyValue('--grid-column-count');
  const apply = () => {
    if (container.style.getPropertyValue('--grid-column-count') !== '1') {
      container.style.setProperty('--grid-column-count', '1');
    }
  };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(container, { attributes: true, attributeFilter: ['style'] });

  return {
    uninstall() {
      observer.disconnect();
      if (previous) container.style.setProperty('--grid-column-count', previous);
      else container.style.removeProperty('--grid-column-count');
    },
  };
}
