import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { deleteCalendarEvent, entitySupportsDelete } from '../shared/ha-subscriptions.js';
import type { HomeAssistant, CalendarEvent } from '../shared/types.js';

function formatDateTime(value: string): string {
  const d = new Date(value);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

@customElement('lucarne-calendar-event-popover')
export class LucarneCalendarEventPopover extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 200;
      }
      .backdrop {
        position: absolute;
        inset: 0;
      }
      .popover {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--lucarne-surface);
        border-radius: var(--lucarne-radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        padding: var(--lucarne-spacing-xl);
        min-width: 280px;
        max-width: min(480px, 90vw);
        z-index: 1;
      }
      .popover-header {
        display: flex;
        align-items: flex-start;
        gap: var(--lucarne-spacing-md);
        margin-bottom: var(--lucarne-spacing-md);
      }
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 4px;
      }
      .event-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        line-height: 1.3;
      }
      .close-btn {
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
      }
      .close-btn:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .detail-row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: flex-start;
        margin-bottom: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        line-height: 1.4;
      }
      .detail-icon {
        flex-shrink: 0;
        font-style: normal;
        width: 18px;
        text-align: center;
      }
      .detail-text {
        color: var(--lucarne-on-surface);
      }
      .calendar-label {
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .ext-link {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--primary-color, #03a9f4);
        text-decoration: none;
        font-size: var(--lucarne-fs-sm);
        margin-top: var(--lucarne-spacing-md);
        min-height: 44px;
      }
      .actions {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        justify-content: flex-start;
        margin-top: var(--lucarne-spacing-md);
      }
      .btn {
        border: none;
        border-radius: var(--lucarne-radius-sm);
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        padding: 8px 14px;
        min-height: 44px;
      }
      .btn-delete {
        background: #c62828;
        color: #fff;
      }
      .btn-delete:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-cancel {
        background: rgba(0, 0, 0, 0.08);
        color: var(--lucarne-on-surface);
      }
      .btn-cancel:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .error-msg {
        color: #c62828;
        font-size: var(--lucarne-fs-sm);
        margin-top: var(--lucarne-spacing-sm);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Object }) event: CalendarEvent | null = null;
  @property({ type: String }) color = '#a8d8b9';
  @property({ type: String }) calendarLabel = '';
  @property({ type: String }) entityId = '';

  @state() private _confirmingDelete = false;
  @state() private _deleting = false;
  @state() private _deleteError = '';

  private _close() {
    this.dispatchEvent(new CustomEvent('popover-close', { bubbles: true, composed: true }));
  }

  private _isRecurring(e: CalendarEvent): boolean {
    return Boolean(e.rrule) || Boolean(e.recurrence_id);
  }

  private _startDelete() {
    this._confirmingDelete = true;
    this._deleteError = '';
  }

  private _cancelDelete() {
    this._confirmingDelete = false;
  }

  private async _confirmDelete() {
    if (!this.event?.uid || !this.entityId) return;
    this._deleting = true;
    this._deleteError = '';
    // The card stores uid as "entityId::originalUid" for color lookup.
    // Strip the prefix before calling the service — HA expects the original uid.
    const rawUid = this.event.uid.includes('::')
      ? this.event.uid.split('::').slice(1).join('::')
      : this.event.uid;
    try {
      await deleteCalendarEvent(this.hass, this.entityId, rawUid);
    } catch (err) {
      this._deleteError = err instanceof Error ? err.message : 'Failed to delete event';
      this._deleting = false;
      this._confirmingDelete = false;
      return;
    }
    this.dispatchEvent(new CustomEvent('lucarne-event-deleted', {
      detail: { entityId: this.entityId, uid: this.event.uid },
      bubbles: true,
      composed: true,
    }));
    this._deleting = false;
    this._confirmingDelete = false;
  }

  render() {
    if (!this.event) return html``;
    const e = this.event;
    const isAllDay = e.start.length === 10 && !e.start.includes('T');

    const timeDisplay = isAllDay
      ? 'All day'
      : `${formatDateTime(e.start)} – ${new Date(e.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    // Google Calendar deep link. The card prefixes uid as "entity_id::original_uid"
    // for internal color lookup; strip the prefix to recover the original Google ID.
    const rawUid = e.uid?.includes('::') ? e.uid.split('::').slice(1).join('::') : e.uid;
    const googleLink =
      rawUid && rawUid.length > 0
        ? `https://calendar.google.com/calendar/u/0/r/eventedit/${encodeURIComponent(rawUid)}`
        : null;

    const canDelete = Boolean(this.entityId)
      && Boolean(e.uid)
      && this.hass != null
      && entitySupportsDelete(this.hass, this.entityId)
      && !this._isRecurring(e);

    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="popover" role="dialog" aria-modal="true">
        <div class="popover-header">
          <span class="color-dot" style="background:${this.color}"></span>
          <span class="event-title">${e.summary}</span>
          <button class="close-btn" @click=${this._close} aria-label="Close">✕</button>
        </div>

        <div class="detail-row">
          <em class="detail-icon">⏰</em>
          <span class="detail-text">${timeDisplay}</span>
        </div>

        ${this.calendarLabel
          ? html`
              <div class="detail-row">
                <em class="detail-icon">📅</em>
                <span class="calendar-label detail-text">
                  <span
                    style="width:8px;height:8px;border-radius:50%;background:${this.color};display:inline-block;flex-shrink:0"
                  ></span>
                  ${this.calendarLabel}
                </span>
              </div>
            `
          : ''}

        ${e.location
          ? html`
              <div class="detail-row">
                <em class="detail-icon">📍</em>
                <span class="detail-text">${e.location}</span>
              </div>
            `
          : ''}

        ${e.description
          ? html`
              <div class="detail-row">
                <em class="detail-icon">📝</em>
                <span class="detail-text">${e.description}</span>
              </div>
            `
          : ''}

        ${googleLink
          ? html`
              <a class="ext-link" href="${googleLink}" target="_blank" rel="noopener noreferrer">
                Open in Google Calendar ↗
              </a>
            `
          : ''}

        ${this._deleteError ? html`<div class="error-msg">${this._deleteError}</div>` : ''}

        ${canDelete ? html`
          <div class="actions">
            ${this._confirmingDelete
              ? html`
                  <button class="btn btn-cancel" @click=${this._cancelDelete} ?disabled=${this._deleting}>Cancel</button>
                  <button class="btn btn-delete" @click=${this._confirmDelete} ?disabled=${this._deleting}>Confirm delete?</button>
                `
              : html`<button class="btn btn-delete" @click=${this._startDelete}>Delete</button>`}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-event-popover': LucarneCalendarEventPopover;
  }
}
