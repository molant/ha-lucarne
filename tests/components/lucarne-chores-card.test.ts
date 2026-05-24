import { describe, it } from 'node:test';

/**
 * Phase 4 will replace these skips with full component tests for the rewritten
 * chores card. Each block documents the intended test coverage so Phase 4 has
 * a clear starting point.
 *
 * makeFakeHass() (tests/setup/ha-mock.mjs) provides the shared HA stub.
 */

describe('lucarne-chores-card', () => {
  it.skip('renders a column per configured member', () => {
    // import the card, create via document.createElement, set hass + config,
    // wait for Lit update, assert shadow DOM contains .member-column × members.length
  });

  it.skip('subscribes to each member todo entity via connection.subscribeMessage', () => {
    // verify fakeHass.calls.subscribeMessage contains one entry per member
  });

  it.skip('checks off a routine by calling todo.update_item via callService', () => {
    // click a routine row, assert fakeHass.calls.callService[0] matches payload
  });

  it.skip('calls lucarne_family.add_task service when the Add-task popover is submitted', () => {
    // open popover, fill summary + type, submit, assert callService payload
  });

  it.skip('renders error block for legacy kids: config', () => {
    // set config with kids: [...], assert shadow DOM shows the migration-error block
  });
});
