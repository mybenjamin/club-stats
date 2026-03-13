<script setup lang="ts">
import type { DashboardSummary, FilterOption, PlayerSortKey, PlayerViewModel } from '~/types/player'

const props = defineProps<{
  players: PlayerViewModel[]
  summary: DashboardSummary
  positionOptions: FilterOption[]
  nationalityOptions: FilterOption[]
}>()

const searchQuery = ref('')
const selectedPosition = ref('all')
const selectedNationality = ref('all')
const sortKey = ref<PlayerSortKey>('overallRating')
const sortDirection = ref<'asc' | 'desc'>('desc')
const comparedPlayerIds = ref<string[]>([])

const sortOptions = [
  { label: 'Overall rating', value: 'overallRating' },
  { label: 'Average rating', value: 'averageRating' },
  { label: 'Goals', value: 'goals' },
  { label: 'Assists', value: 'assists' },
  { label: 'Goal contributions', value: 'goalContributions' },
  { label: 'Win rate', value: 'winRate' },
  { label: 'Games played', value: 'gamesPlayed' }
] satisfies Array<{ label: string, value: PlayerSortKey }>

const positionItems = computed(() => [
  { label: 'All roles', value: 'all' },
  ...props.positionOptions
])

const nationalityItems = computed(() => [
  { label: 'All nationalities', value: 'all' },
  ...props.nationalityOptions
])

const filteredPlayers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const direction = sortDirection.value === 'desc' ? -1 : 1

  return props.players
    .filter((player) => {
      const matchesQuery = !query
        || player.handle.toLowerCase().includes(query)
        || player.proName.toLowerCase().includes(query)
        || player.positionLabel.toLowerCase().includes(query)
        || player.nationalityLabel.toLowerCase().includes(query)

      const matchesPosition = selectedPosition.value === 'all'
        || player.favoritePosition === selectedPosition.value

      const matchesNationality = selectedNationality.value === 'all'
        || player.nationalityCode === selectedNationality.value

      return matchesQuery && matchesPosition && matchesNationality
    })
    .slice()
    .sort((left, right) => {
      const leftValue = left[sortKey.value]
      const rightValue = right[sortKey.value]

      if (leftValue === rightValue) {
        return left.proName.localeCompare(right.proName)
      }

      return (leftValue > rightValue ? 1 : -1) * direction
    })
})

const comparedPlayers = computed(() => props.players.filter(player => comparedPlayerIds.value.includes(player.id)))
const compareLimitReached = computed(() => comparedPlayerIds.value.length >= 3)

function toggleCompare(playerId: string) {
  if (comparedPlayerIds.value.includes(playerId)) {
    comparedPlayerIds.value = comparedPlayerIds.value.filter(id => id !== playerId)

    return
  }

  if (compareLimitReached.value) {
    return
  }

  comparedPlayerIds.value = [...comparedPlayerIds.value, playerId]
}

function resetFilters() {
  searchQuery.value = ''
  selectedPosition.value = 'all'
  selectedNationality.value = 'all'
  sortKey.value = 'overallRating'
  sortDirection.value = 'desc'
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
}

function summaryValue(value: number, suffix = '') {
  return `${value}${suffix}`
}
</script>

<template>
  <div class="dashboard-shell mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <section class="dashboard-hero overflow-hidden rounded-[2rem] border border-primary/15 px-5 py-6 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.95)] sm:px-8 sm:py-8">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:items-end">
        <div class="space-y-5">
          <UBadge
            color="primary"
            variant="soft"
            class="rounded-full px-3 py-1 uppercase tracking-[0.25em]"
          >
            Club overview
          </UBadge>

          <div class="max-w-3xl space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl">
              Dark-first player dashboard for the current squad snapshot.
            </h1>
            <p class="max-w-2xl text-base leading-7 text-toned sm:text-lg">
              Scan the squad, surface in-form performers, and keep a lightweight compare queue ready for deeper selection decisions.
            </p>
          </div>
        </div>

        <UCard
          variant="subtle"
          class="border border-default/70 bg-black/20 backdrop-blur"
        >
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
            <div class="rounded-2xl border border-default/60 bg-default/35 p-4">
              <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
                Players
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ summaryValue(summary.totalPlayers) }}
              </p>
            </div>

            <div class="rounded-2xl border border-default/60 bg-default/35 p-4">
              <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
                Goals
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ summaryValue(summary.totalGoals) }}
              </p>
            </div>

            <div class="rounded-2xl border border-default/60 bg-default/35 p-4">
              <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
                Assists
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ summaryValue(summary.totalAssists) }}
              </p>
            </div>

            <div class="rounded-2xl border border-default/60 bg-default/35 p-4">
              <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
                Avg rating
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ summaryValue(summary.averageRating, '') }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UBadge
          v-for="(count, position) in summary.positionCounts"
          :key="position"
          color="neutral"
          variant="outline"
          class="rounded-full px-3 py-1"
        >
          {{ position }}: {{ count }}
        </UBadge>
      </div>
    </section>

    <UCard
      variant="subtle"
      class="border border-default/70 bg-elevated/80 backdrop-blur"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div class="flex-1">
          <p class="mb-2 text-sm font-medium text-toned">
            Search player or role
          </p>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            color="neutral"
            variant="outline"
            size="xl"
            placeholder="Search by handle, pro name, role, or nation"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:w-[520px] lg:grid-cols-3">
          <div>
            <p class="mb-2 text-sm font-medium text-toned">
              Role
            </p>
            <USelect
              v-model="selectedPosition"
              :items="positionItems"
              value-key="value"
              class="w-full"
              color="neutral"
              variant="outline"
            />
          </div>

          <div>
            <p class="mb-2 text-sm font-medium text-toned">
              Nationality
            </p>
            <USelect
              v-model="selectedNationality"
              :items="nationalityItems"
              value-key="value"
              class="w-full"
              color="neutral"
              variant="outline"
            />
          </div>

          <div>
            <p class="mb-2 text-sm font-medium text-toned">
              Sort by
            </p>
            <USelect
              v-model="sortKey"
              :items="sortOptions"
              value-key="value"
              class="w-full"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-3 border-t border-default/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-toned">
          Showing {{ filteredPlayers.length }} of {{ players.length }} players.
        </p>

        <div class="flex flex-wrap gap-3">
          <UButton
            color="neutral"
            variant="outline"
            :icon="sortDirection === 'desc' ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'"
            :label="sortDirection === 'desc' ? 'Descending' : 'Ascending'"
            @click="toggleSortDirection"
          />
          <UButton
            color="neutral"
            variant="ghost"
            label="Reset filters"
            icon="i-lucide-rotate-ccw"
            @click="resetFilters"
          />
        </div>
      </div>
    </UCard>

    <UCard
      v-if="comparedPlayers.length"
      variant="soft"
      class="border border-primary/20 bg-primary/8"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.22em] text-primary/80">
            Compare queue
          </p>
          <p class="mt-1 text-sm text-toned">
            Up to three players can be pinned for side-by-side discussion.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="player in comparedPlayers"
            :key="player.id"
            color="primary"
            variant="soft"
            class="rounded-full px-3 py-1"
          >
            {{ player.proName }} · {{ player.overallRating }} OVR
          </UBadge>
        </div>

        <UButton
          color="neutral"
          variant="outline"
          label="Clear compare"
          icon="i-lucide-x"
          @click="comparedPlayerIds = []"
        />
      </div>
    </UCard>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <PlayerCard
        v-for="player in filteredPlayers"
        :key="player.id"
        :player="player"
        :compared="comparedPlayerIds.includes(player.id)"
        :compare-disabled="compareLimitReached"
        @toggle-compare="toggleCompare"
      />
    </section>

    <UCard
      v-if="!filteredPlayers.length"
      variant="subtle"
      class="border border-dashed border-default/80 bg-elevated/70"
    >
      <div class="flex flex-col items-start gap-3 py-4">
        <UBadge
          color="neutral"
          variant="outline"
        >
          No matches
        </UBadge>
        <p class="max-w-xl text-sm leading-6 text-toned">
          No players match the current filter set. Reset the role, nationality, or search criteria to restore the full squad grid.
        </p>
        <UButton
          color="primary"
          variant="soft"
          label="Reset filters"
          icon="i-lucide-refresh-cw"
          @click="resetFilters"
        />
      </div>
    </UCard>
  </div>
</template>
