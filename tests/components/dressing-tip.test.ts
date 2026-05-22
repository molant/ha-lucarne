import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dressingTip } from '../../src/components/dressing-tip.js';
import type { WeatherForecast } from '../../src/shared/types.js';

function makeDay(temperature: number, condition = 'sunny', precipitation_probability = 0): WeatherForecast {
  return { datetime: '2026-05-21T00:00:00', temperature, condition, precipitation_probability };
}

describe('dressingTip', () => {
  it('returns default for empty forecast', () => {
    assert.equal(dressingTip([]), 'Check the weather');
  });

  it('heavy coat + hat below 5 °C', () => {
    assert.equal(dressingTip([makeDay(3)]), 'Heavy coat + hat');
  });

  it('coat + scarf from 5 to 12 °C', () => {
    assert.equal(dressingTip([makeDay(5)]), 'Coat + scarf');
    assert.equal(dressingTip([makeDay(11)]), 'Coat + scarf');
  });

  it('light jacket from 12 to 18 °C', () => {
    assert.equal(dressingTip([makeDay(12)]), 'Light jacket');
    assert.equal(dressingTip([makeDay(17)]), 'Light jacket');
  });

  it('t-shirt from 18 to 24 °C', () => {
    assert.equal(dressingTip([makeDay(18)]), 'T-shirt');
    assert.equal(dressingTip([makeDay(23)]), 'T-shirt');
  });

  it('shorts weather above 24 °C', () => {
    assert.equal(dressingTip([makeDay(24)]), 'Shorts weather');
    assert.equal(dressingTip([makeDay(32)]), 'Shorts weather');
  });

  it('appends umbrella when precip probability > 50%', () => {
    assert.equal(dressingTip([makeDay(20, 'sunny', 60)]), 'T-shirt + umbrella');
  });

  it('does NOT append umbrella when precip probability <= 50%', () => {
    assert.equal(dressingTip([makeDay(20, 'sunny', 50)]), 'T-shirt');
  });

  it('boots + heavy coat for snowy condition regardless of temp', () => {
    assert.equal(dressingTip([makeDay(25, 'snowy')]), 'Boots + heavy coat');
  });

  it('boots + heavy coat for snowy-rainy condition', () => {
    assert.equal(dressingTip([makeDay(3, 'snowy-rainy')]), 'Boots + heavy coat');
  });

  it('snow check is case-insensitive', () => {
    assert.equal(dressingTip([makeDay(20, 'Snowy')]), 'Boots + heavy coat');
  });
});
