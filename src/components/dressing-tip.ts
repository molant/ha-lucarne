import type { WeatherForecast } from '../shared/types.js';
import { STRINGS } from '../shared/strings.js';

export function dressingTip(forecast: WeatherForecast[]): string {
  if (!forecast.length) return STRINGS.dressingTipDefault;

  const today = forecast[0];
  const condition = today.condition.toLowerCase();

  if (condition.includes('snow')) {
    return STRINGS.dressingTipBoots;
  }

  const temp = today.temperature;
  let tip: string;

  if (temp < 5) {
    tip = STRINGS.dressingTipHeavyCoat;
  } else if (temp < 12) {
    tip = STRINGS.dressingTipCoatScarf;
  } else if (temp < 18) {
    tip = STRINGS.dressingTipLightJacket;
  } else if (temp < 24) {
    tip = STRINGS.dressingTipTShirt;
  } else {
    tip = STRINGS.dressingTipShorts;
  }

  const precip = today.precipitation_probability ?? 0;
  if (precip > 50) {
    tip += STRINGS.dressingTipUmbrella;
  }

  return tip;
}
