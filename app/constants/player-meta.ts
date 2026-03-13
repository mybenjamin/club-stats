import type { PlayerPosition } from '~/types/player'

export const TREND_FIELDS = [
  'prevGoals1',
  'prevGoals2',
  'prevGoals3',
  'prevGoals4',
  'prevGoals5',
  'prevGoals6',
  'prevGoals7',
  'prevGoals8',
  'prevGoals9',
  'prevGoals10'
] as const

export const DEFAULT_POSITION_COUNTS: Record<PlayerPosition, number> = {
  forward: 0,
  midfielder: 0,
  defender: 0,
  goalkeeper: 0,
  unknown: 0
}

export const FAVORITE_POSITION_LABELS: Record<PlayerPosition, string> = {
  forward: 'Forward line',
  midfielder: 'Midfield engine',
  defender: 'Defensive unit',
  goalkeeper: 'Goalkeeper',
  unknown: 'Utility role'
}

export const POSITION_LABELS: Record<string, string> = {
  14: 'Attacking midfield',
  25: 'Striker'
}

export const NATIONALITY_LABELS: Record<string, string> = {
  14: 'Nation 14',
  52: 'Nation 52',
  140: 'South Africa'
}
