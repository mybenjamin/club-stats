import mockData from '~/data/mock-data.json'
import {
  DEFAULT_POSITION_COUNTS,
  FAVORITE_POSITION_LABELS,
  NATIONALITY_LABELS,
  POSITION_LABELS,
  TREND_FIELDS
} from '~/constants/player-meta'
import type {
  DashboardSummary,
  FilterOption,
  PlayerDashboardSource,
  PlayerPosition,
  PlayerViewModel,
  RawPlayerRecord
} from '~/types/player'

const sourceData = mockData as PlayerDashboardSource

function toNumber(value: string | number | undefined): number {
  const normalized = Number(value ?? 0)

  return Number.isFinite(normalized) ? normalized : 0
}

function normalizePosition(value: string): PlayerPosition {
  switch (value.toLowerCase()) {
    case 'forward':
    case 'midfielder':
    case 'defender':
    case 'goalkeeper':
      return value.toLowerCase() as PlayerPosition
    default:
      return 'unknown'
  }
}

function normalizePlayer(rawPlayer: RawPlayerRecord): PlayerViewModel {
  const favoritePosition = normalizePosition(rawPlayer.favoritePosition)
  const goalTrend = TREND_FIELDS.map(field => toNumber(rawPlayer[field]))

  return {
    id: rawPlayer.name,
    handle: rawPlayer.name,
    proName: rawPlayer.proName,
    favoritePosition,
    favoritePositionLabel: FAVORITE_POSITION_LABELS[favoritePosition],
    positionCode: rawPlayer.proPos,
    positionLabel: POSITION_LABELS[rawPlayer.proPos] ?? FAVORITE_POSITION_LABELS[favoritePosition],
    nationalityCode: rawPlayer.proNationality,
    nationalityLabel: NATIONALITY_LABELS[rawPlayer.proNationality] ?? `Nation ${rawPlayer.proNationality}`,
    heightCm: toNumber(rawPlayer.proHeight),
    overallRating: toNumber(rawPlayer.proOverall),
    averageRating: toNumber(rawPlayer.ratingAve),
    gamesPlayed: toNumber(rawPlayer.gamesPlayed),
    winRate: toNumber(rawPlayer.winRate),
    goals: toNumber(rawPlayer.goals),
    assists: toNumber(rawPlayer.assists),
    goalContributions: toNumber(rawPlayer.goals) + toNumber(rawPlayer.assists),
    cleanSheetsDef: toNumber(rawPlayer.cleanSheetsDef),
    cleanSheetsGK: toNumber(rawPlayer.cleanSheetsGK),
    shotSuccessRate: toNumber(rawPlayer.shotSuccessRate),
    passesMade: toNumber(rawPlayer.passesMade),
    passSuccessRate: toNumber(rawPlayer.passSuccessRate),
    tacklesMade: toNumber(rawPlayer.tacklesMade),
    tackleSuccessRate: toNumber(rawPlayer.tackleSuccessRate),
    manOfTheMatch: toNumber(rawPlayer.manOfTheMatch),
    redCards: toNumber(rawPlayer.redCards),
    goalTrend
  }
}

function roundToSingleDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function deriveDashboardSummary(players: PlayerViewModel[]): DashboardSummary {
  const totals = players.reduce(
    (summary, player) => {
      summary.totalGoals += player.goals
      summary.totalAssists += player.assists
      summary.averageRating += player.averageRating
      summary.positionCounts[player.favoritePosition] += 1

      return summary
    },
    {
      totalGoals: 0,
      totalAssists: 0,
      averageRating: 0,
      positionCounts: { ...DEFAULT_POSITION_COUNTS }
    }
  )

  return {
    totalPlayers: players.length,
    totalGoals: totals.totalGoals,
    totalAssists: totals.totalAssists,
    averageRating: roundToSingleDecimal(totals.averageRating / Math.max(players.length, 1)),
    positionCounts: totals.positionCounts
  }
}

const normalizedPlayers = sourceData.members.map(normalizePlayer)
const dashboardSummary = deriveDashboardSummary(normalizedPlayers)

function buildPositionOptions(players: PlayerViewModel[]): FilterOption[] {
  const seen = new Set<PlayerPosition>()

  return players.reduce<FilterOption[]>((options, player) => {
    if (seen.has(player.favoritePosition)) {
      return options
    }

    seen.add(player.favoritePosition)
    options.push({
      label: player.favoritePositionLabel,
      value: player.favoritePosition
    })

    return options
  }, [])
}

function buildNationalityOptions(players: PlayerViewModel[]): FilterOption[] {
  const seen = new Set<string>()

  return players.reduce<FilterOption[]>((options, player) => {
    if (seen.has(player.nationalityCode)) {
      return options
    }

    seen.add(player.nationalityCode)
    options.push({
      label: player.nationalityLabel,
      value: player.nationalityCode
    })

    return options
  }, [])
}

const positionOptions = buildPositionOptions(normalizedPlayers)
const nationalityOptions = buildNationalityOptions(normalizedPlayers)

export function usePlayerDashboard() {
  return {
    players: normalizedPlayers,
    summary: dashboardSummary,
    positionOptions,
    nationalityOptions
  }
}
