/**
 * Shared HomeAssistant stub for component tests.
 *
 * makeFakeHass() returns a minimal HA mock that satisfies the HomeAssistant
 * interface used across cards. Each channel records calls on a public `calls`
 * map so tests can assert on payloads and ordering.
 *
 * Usage:
 *   import { makeFakeHass } from '../setup/ha-mock.mjs';
 *   const fakeHass = makeFakeHass();
 *   fakeHass.states['todo.anna'] = { state: 'on', attributes: {} };
 *   element.hass = fakeHass;
 *   // later:
 *   assert.equal(fakeHass.calls.callService.length, 1);
 */

/**
 * @returns {import('../../src/shared/types.js').HomeAssistant & { calls: object }}
 */
export function makeFakeHass(overrides = {}) {
  const calls = {
    subscribeMessage: [],
    sendMessagePromise: [],
    subscribeEvents: [],
    callApi: [],
    callService: [],
    callWS: [],
  };

  const hass = {
    states: {},
    connection: {
      async subscribeMessage(callback, payload) {
        calls.subscribeMessage.push({ callback, payload });
        return async () => {};
      },
      async sendMessagePromise(payload) {
        calls.sendMessagePromise.push({ payload });
        return undefined;
      },
      async subscribeEvents(callback, eventType) {
        calls.subscribeEvents.push({ callback, eventType });
        return async () => {};
      },
    },
    async callApi(method, path, body) {
      calls.callApi.push({ method, path, body });
      return undefined;
    },
    async callService(domain, service, payload, target) {
      calls.callService.push({ domain, service, payload, target });
      return undefined;
    },
    async callWS(payload) {
      calls.callWS.push({ payload });
      return undefined;
    },
    calls,
    ...overrides,
  };

  return hass;
}
