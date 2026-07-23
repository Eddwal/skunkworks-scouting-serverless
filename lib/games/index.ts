import { GameConfig } from './types';
import { Game2026 } from './2026';
import { Game2025 } from './2025';
import { Game2027 } from './2027';

const GAME_CONFIGS: Record<string, GameConfig> = {
  '2027': Game2027,
  '2026': Game2026,
  '2025': Game2025,
};

export const DEFAULT_YEAR = '2026';

export function getGameConfig(year?: string | null): GameConfig {
  if (year && GAME_CONFIGS[year]) {
    return GAME_CONFIGS[year];
  }
  return GAME_CONFIGS[DEFAULT_YEAR];
}
