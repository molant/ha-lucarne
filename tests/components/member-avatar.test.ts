import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneMemberAvatar } from '../../src/components/member-avatar.js';

await import('../../src/components/member-avatar.js');

function makeEl(opts: { name?: string; color?: string; avatar?: string | null } = {}): LucarneMemberAvatar {
  const el = document.createElement('lucarne-member-avatar') as LucarneMemberAvatar;
  el.name = opts.name ?? 'Anna';
  el.color = opts.color ?? '#f5c89c';
  el.avatar = opts.avatar !== undefined ? opts.avatar : null;
  document.body.appendChild(el);
  return el;
}

function shadow(el: LucarneMemberAvatar, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-member-avatar').forEach((el) => el.remove());
});

describe('lucarne-member-avatar', () => {
  it('renders colored initial circle when avatar is null', async () => {
    const el = makeEl({ name: 'Anna', avatar: null });
    await el.updateComplete;

    const avatarDiv = shadow(el, '.avatar');
    assert.ok(avatarDiv, '.avatar div rendered');
    assert.ok((avatarDiv as HTMLElement).style.background.length > 0);

    const initialSpan = shadow(el, '.initial');
    assert.ok(initialSpan, '.initial span rendered');
    assert.equal(initialSpan!.textContent, 'A');

    const img = shadow(el, 'img');
    assert.equal(img, null, 'no img for null avatar');

    const emojiSpan = shadow(el, '.emoji');
    assert.equal(emojiSpan, null, 'no emoji for null avatar');
  });

  it('renders colored initial circle when avatar is empty string', async () => {
    const el = makeEl({ name: 'Bob', avatar: '' });
    await el.updateComplete;

    const initialSpan = shadow(el, '.initial');
    assert.ok(initialSpan, '.initial rendered for empty avatar');
    assert.equal(initialSpan!.textContent, 'B');
  });

  it('renders emoji in circle when avatar is a single emoji', async () => {
    const el = makeEl({ name: 'Anna', avatar: '🪥' });
    await el.updateComplete;

    const emojiSpan = shadow(el, '.emoji');
    assert.ok(emojiSpan, '.emoji span rendered');
    assert.equal(emojiSpan!.textContent, '🪥');

    const img = shadow(el, 'img');
    assert.equal(img, null, 'no img for emoji avatar');

    const initialSpan = shadow(el, '.initial');
    assert.equal(initialSpan, null, 'no initial for emoji avatar');
  });

  it('renders img tag when avatar starts with /local/', async () => {
    const el = makeEl({ name: 'Anna', avatar: '/local/lucarne/avatars/anna.png' });
    await el.updateComplete;

    const img = shadow(el, 'img') as HTMLImageElement | null;
    assert.ok(img, 'img element rendered');
    assert.equal(img!.getAttribute('src'), '/local/lucarne/avatars/anna.png');

    const emojiSpan = shadow(el, '.emoji');
    assert.equal(emojiSpan, null, 'no emoji for /local/ avatar');
  });

  it('renders emoji for ZWJ family sequence', async () => {
    const el = makeEl({ name: 'Anna', avatar: '👨‍👩‍👧' });
    await el.updateComplete;

    const emojiSpan = shadow(el, '.emoji');
    assert.ok(emojiSpan, '.emoji span rendered for ZWJ family');
    assert.equal(emojiSpan!.textContent, '👨‍👩‍👧');

    const initialSpan = shadow(el, '.initial');
    assert.equal(initialSpan, null, 'no initial fallback for ZWJ family');
  });

  it('renders emoji for skin-tone-modified glyph', async () => {
    const el = makeEl({ name: 'Anna', avatar: '👋🏻' });
    await el.updateComplete;

    const emojiSpan = shadow(el, '.emoji');
    assert.ok(emojiSpan, '.emoji span rendered for modifier sequence');
    assert.equal(emojiSpan!.textContent, '👋🏻');
  });

  it('renders emoji for variation-selector heart', async () => {
    const el = makeEl({ name: 'Anna', avatar: '❤️' });
    await el.updateComplete;

    const emojiSpan = shadow(el, '.emoji');
    assert.ok(emojiSpan, '.emoji span rendered for ❤️ (with VS16)');
    assert.equal(emojiSpan!.textContent, '❤️');
  });

  it('renders emoji for regional-indicator flag', async () => {
    const el = makeEl({ name: 'Anna', avatar: '🇺🇸' });
    await el.updateComplete;

    const emojiSpan = shadow(el, '.emoji');
    assert.ok(emojiSpan, '.emoji span rendered for flag');
    assert.equal(emojiSpan!.textContent, '🇺🇸');
  });

  it('falls back to initial for plain text avatar', async () => {
    const el = makeEl({ name: 'Anna', avatar: 'hello' });
    await el.updateComplete;

    const initialSpan = shadow(el, '.initial');
    assert.ok(initialSpan, '.initial rendered for plain text');
    assert.equal(initialSpan!.textContent, 'A');
  });

  it('has aria-label on the avatar div', async () => {
    const el = makeEl({ name: 'Charlie', avatar: null });
    await el.updateComplete;

    const avatarDiv = shadow(el, '.avatar');
    assert.ok(avatarDiv, '.avatar div present');
    assert.equal((avatarDiv as HTMLElement).getAttribute('aria-label'), "Charlie's avatar");
  });
});
