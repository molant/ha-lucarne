import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

(window as Window & typeof globalThis & { customCards?: object[] }).customCards =
  (window as Window & typeof globalThis & { customCards?: object[] }).customCards || [];
(window as Window & typeof globalThis & { customCards?: object[] }).customCards!.push({
  type: "lucarne-today-card",
  name: "Lucarne Today",
  description: "Family agenda + weather + tasks + presence",
});

@customElement("lucarne-today-card")
export class LucarneTodayCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: var(--primary-font-family, sans-serif);
    }
  `;

  render() {
    return html`<div>ha-lucarne · Today (placeholder)</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lucarne-today-card": LucarneTodayCard;
  }
}
