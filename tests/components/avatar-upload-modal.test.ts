import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { makeFakeHass } from '../setup/ha-mock.mjs';
import type { LucarneAvatarUploadModal } from '../../src/components/avatar-upload-modal.js';

await import('../../src/components/avatar-upload-modal.js');

function makeEl(memberSlug = 'anna', memberName = 'Anna'): LucarneAvatarUploadModal {
  const el = document.createElement('lucarne-avatar-upload-modal') as LucarneAvatarUploadModal;
  el.hass = makeFakeHass() as any;
  el.memberSlug = memberSlug;
  el.memberName = memberName;
  document.body.appendChild(el);
  return el;
}

function shadow(el: LucarneAvatarUploadModal, sel: string): Element | null {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-avatar-upload-modal').forEach((el) => el.remove());
});

describe('lucarne-avatar-upload-modal', () => {
  it('renders backdrop and modal', async () => {
    const el = makeEl();
    await el.updateComplete;

    assert.ok(shadow(el, '.backdrop'), 'backdrop rendered');
    assert.ok(shadow(el, '.modal'), 'modal rendered');
    assert.ok(shadow(el, '.modal-title'), 'modal title rendered');
  });

  it('shows emoji tab active by default', async () => {
    const el = makeEl();
    await el.updateComplete;

    const activeTab = shadow(el, '.mode-tab.active');
    assert.ok(activeTab?.textContent?.toLowerCase().includes('emoji'), 'emoji tab active');
    assert.ok(shadow(el, '.emoji-grid'), 'emoji grid shown in default mode');
  });

  it('switches to upload mode on tab click', async () => {
    const el = makeEl();
    await el.updateComplete;

    const tabs = el.shadowRoot!.querySelectorAll('.mode-tab');
    const uploadTab = Array.from(tabs).find((t) => t.textContent?.toLowerCase().includes('upload'));
    assert.ok(uploadTab, 'upload tab present');
    (uploadTab as HTMLElement).click();
    await el.updateComplete;

    assert.ok(shadow(el, '.upload-area'), 'upload area shown after switching mode');
    assert.ok(!shadow(el, '.emoji-grid'), 'emoji grid hidden in upload mode');
  });

  it('emoji mode: clicking Save calls set_member_avatar with selected emoji', async () => {
    const fakeHass = makeFakeHass();
    const el = makeEl();
    el.hass = fakeHass as any;
    await el.updateComplete;

    // Pick first emoji in grid
    const firstEmoji = shadow(el, '.emoji-btn') as HTMLElement;
    assert.ok(firstEmoji, 'emoji buttons present');
    const emojiText = firstEmoji.textContent!.trim();
    firstEmoji.click();
    await el.updateComplete;

    // Click Save
    const saveBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-primary')) as HTMLButtonElement[];
    saveBtn[0]?.click();
    await el.updateComplete;

    // Wait for the async service call
    await new Promise((r) => setTimeout(r, 10));

    const serviceCalls = fakeHass.calls.callService;
    assert.equal(serviceCalls.length, 1, 'one service call made');
    assert.equal(serviceCalls[0].domain, 'lucarne_family');
    assert.equal(serviceCalls[0].service, 'set_member_avatar');
    assert.equal(serviceCalls[0].payload.member, 'anna');
    assert.equal(serviceCalls[0].payload.avatar, emojiText);
  });

  it('emoji mode: Save without selection shows error, no service call', async () => {
    const fakeHass = makeFakeHass();
    const el = makeEl();
    el.hass = fakeHass as any;
    await el.updateComplete;

    const saveBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-primary')) as HTMLButtonElement[];
    saveBtn[0]?.click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(fakeHass.calls.callService.length, 0, 'no service call without selection');
    assert.ok(shadow(el, '.error-msg'), 'error message shown');
  });

  it('upload mode: file too large shows inline error, no service call', async () => {
    const fakeHass = makeFakeHass();
    const el = makeEl();
    el.hass = fakeHass as any;
    await el.updateComplete;

    // Switch to upload mode
    const tabs = el.shadowRoot!.querySelectorAll('.mode-tab');
    const uploadTab = Array.from(tabs).find((t) => t.textContent?.toLowerCase().includes('upload')) as HTMLElement;
    uploadTab.click();
    await el.updateComplete;

    // Simulate file input change with oversized file
    const fileInput = shadow(el, 'input[type="file"]') as HTMLInputElement;
    assert.ok(fileInput, 'file input present');

    // Create a fake oversized file (3MB)
    const oversizedFile = new File([new Uint8Array(3 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [oversizedFile] });
    fileInput.dispatchEvent(new Event('change'));
    await el.updateComplete;

    assert.ok(shadow(el, '.error-msg'), 'error message shown for oversized file');
    assert.equal(fakeHass.calls.callService.length, 0, 'no service call for oversized file');
  });

  it('upload mode: wrong MIME type shows inline error', async () => {
    const fakeHass = makeFakeHass();
    const el = makeEl();
    el.hass = fakeHass as any;
    await el.updateComplete;

    const tabs = el.shadowRoot!.querySelectorAll('.mode-tab');
    const uploadTab = Array.from(tabs).find((t) => t.textContent?.toLowerCase().includes('upload')) as HTMLElement;
    uploadTab.click();
    await el.updateComplete;

    const fileInput = shadow(el, 'input[type="file"]') as HTMLInputElement;
    const gifFile = new File([new Uint8Array(100)], 'anim.gif', { type: 'image/gif' });
    Object.defineProperty(fileInput, 'files', { value: [gifFile] });
    fileInput.dispatchEvent(new Event('change'));
    await el.updateComplete;

    assert.ok(shadow(el, '.error-msg'), 'error shown for unsupported MIME type');
  });

  it('upload mode: valid file calls upload_avatar service', async () => {
    const fakeHass = makeFakeHass();
    const el = makeEl();
    el.hass = fakeHass as any;
    await el.updateComplete;

    const tabs = el.shadowRoot!.querySelectorAll('.mode-tab');
    const uploadTab = Array.from(tabs).find((t) => t.textContent?.toLowerCase().includes('upload')) as HTMLElement;
    uploadTab.click();
    await el.updateComplete;

    const fileInput = shadow(el, 'input[type="file"]') as HTMLInputElement;
    // 1x1 png bytes (minimal valid file under 2MB)
    const pngBytes = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, // PNG signature
    ]);
    const pngFile = new File([pngBytes], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [pngFile] });
    fileInput.dispatchEvent(new Event('change'));
    await el.updateComplete;

    const saveBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-primary')) as HTMLButtonElement[];
    saveBtn[0]?.click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 20));

    const serviceCalls = fakeHass.calls.callService;
    assert.equal(serviceCalls.length, 1);
    assert.equal(serviceCalls[0].domain, 'lucarne_family');
    assert.equal(serviceCalls[0].service, 'upload_avatar');
    assert.equal(serviceCalls[0].payload.member, 'anna');
    assert.equal(serviceCalls[0].payload.mime_type, 'image/png');
    assert.ok(typeof serviceCalls[0].payload.image_data === 'string', 'image_data is base64 string');
  });

  it('close button dispatches close event', async () => {
    const el = makeEl();
    await el.updateComplete;

    let closed = false;
    el.addEventListener('close', () => { closed = true; });

    const closeBtn = shadow(el, '.close-btn') as HTMLButtonElement;
    closeBtn.click();

    assert.ok(closed, 'close event fired');
  });
});
