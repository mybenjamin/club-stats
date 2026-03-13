export type PlayerPosition = 'forward' | 'midfielder' | 'defender' | 'goalkeeper' | 'unknown'

export type PlayerSortKey
  = | 'overallRating'
    | 'averageRating'
    | 'goals'
    | 'assists'
    | 'winRate'
    | 'gamesPlayed'
    | 'goalContributions'

export interface RawPlayerRecord {
  name: string
  gamesPlayed: string
  winRate: string
  goals: string
  assists: string
  cleanSheetsDef: string
  cleanSheetsGK: string
  shotSuccessRate: string
  passesMade: string
  passSuccessRate: string
  ratingAve: string
  tacklesMade: string
  tackleSuccessRate: string
  proName: string
  proPos: string
  proStyle: string
  proHeight: string
  proNationality: string
  proOverall: string
  proOverallStr: string
  manOfTheMatch: string
  redCards: string
  prevGoals: string
  prevGoals1: string
  prevGoals2: string
  prevGoals3: string
  prevGoals4: string
  prevGoals5: string
  prevGoals6: string
  prevGoals7: string
  prevGoals8: string
  prevGoals9: string
  prevGoals10: string
  favoritePosition: string
}

export interface PlayerDashboardSource {
  members: RawPlayerRecord[]
  positionCount: Record<string, number>
}

export interface PlayerViewModel {
  id: string
  handle: string
  proName: string
  favoritePosition: PlayerPosition
  favoritePositionLabel: string
  positionCode: string
  positionLabel: string
  nationalityCode: string
  nationalityLabel: string
  heightCm: number
  overallRating: number
  averageRating: number
  gamesPlayed: number
  winRate: number
  goals: number
  assists: number
  goalContributions: number
  cleanSheetsDef: number
  cleanSheetsGK: number
  shotSuccessRate: number
  passesMade: number
  passSuccessRate: number
  tacklesMade: number
  tackleSuccessRate: number
  manOfTheMatch: number
  redCards: number
  goalTrend: number[]
}

export interface DashboardSummary {
  totalPlayers: number
  totalGoals: number
  totalAssists: number
  averageRating: number
  positionCounts: Record<PlayerPosition, number>
}

export interface FilterOption {
  label: string
  value: string
}
