<script setup lang="ts">
import type { PlayerViewModel } from '~/types/player'

const props = withDefaults(defineProps<{
  player: PlayerViewModel
  compared?: boolean
  compareDisabled?: boolean
}>(), {
  compared: false,
  compareDisabled: false
})

const emit = defineEmits<{
  toggleCompare: [playerId: string]
}>()

function formatPercent(value: number) {
  return `${value}%`
}

function compareButtonLabel() {
  if (props.compared) {
    return 'Selected for compare'
  }

  return props.compareDisabled ? 'Compare limit reached' : 'Add to compare'
}
</script>

<template>
  <UCard
    :variant="compared ? 'soft' : 'subtle'"
    class="h-full border border-default/70 bg-elevated/80 shadow-[0_24px_60px_-32px_rgba(2,6,23,0.95)] backdrop-blur"
    :ui="{
      root: compared ? 'ring ring-primary/50' : '',
      header: 'space-y-4',
      body: 'space-y-5',
      footer: 'pt-0'
    }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <UAvatar
            :alt="player.proName"
            size="xl"
            class="ring ring-primary/25"
          />

          <div class="min-w-0">
            <p class="truncate text-lg font-semibold text-highlighted">
              {{ player.proName }}
            </p>
            <p class="truncate text-sm text-toned">
              @{{ player.handle }}
            </p>
          </div>
        </div>

        <UBadge
          color="primary"
          variant="soft"
          size="lg"
        >
          OVR {{ player.overallRating }}
        </UBadge>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UBadge
          color="neutral"
          variant="outline"
        >
          {{ player.positionLabel }}
        </UBadge>
        <UBadge
          color="neutral"
          variant="subtle"
        >
          {{ player.nationalityLabel }}
        </UBadge>
        <UBadge
          color="neutral"
          variant="subtle"
        >
          {{ player.heightCm }} cm
        </UBadge>
      </div>
    </template>

    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-default/60 bg-default/40 p-3">
        <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
          Goals
        </p>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ player.goals }}
        </p>
      </div>

      <div class="rounded-2xl border border-default/60 bg-default/40 p-3">
        <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
          Assists
        </p>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ player.assists }}
        </p>
      </div>

      <div class="rounded-2xl border border-default/60 bg-default/40 p-3">
        <p class="text-[11px] uppercase tracking-[0.2em] text-muted">
          Avg rating
        </p>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ player.averageRating.toFixed(1) }}
        </p>
      </div>
    </div>

    <USeparator
      label="Precision"
      color="primary"
    />

    <div class="grid grid-cols-2 gap-3 text-sm text-toned sm:grid-cols-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          Win rate
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ formatPercent(player.winRate) }}
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          Shot success
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ formatPercent(player.shotSuccessRate) }}
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          Pass success
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ formatPercent(player.passSuccessRate) }}
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          Tackles won
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ formatPercent(player.tackleSuccessRate) }}
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          MOTM
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ player.manOfTheMatch }}
        </p>
      </div>

      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-muted">
          Red cards
        </p>
        <p class="mt-1 font-medium text-highlighted">
          {{ player.redCards }}
        </p>
      </div>
    </div>

    <USeparator
      label="Trend"
      color="primary"
    />

    <PlayerTrendSparkline :trend="player.goalTrend" />

    <template #footer>
      <div class="flex items-center gap-3">
        <UButton
          block
          color="primary"
          :variant="compared ? 'solid' : 'outline'"
          :disabled="compareDisabled && !compared"
          :label="compareButtonLabel()"
          :icon="compared ? 'i-lucide-check' : 'i-lucide-scale'"
          @click="emit('toggleCompare', player.id)"
        />

        <UBadge
          v-if="compared"
          color="primary"
          variant="soft"
        >
          Ready
        </UBadge>
      </div>
    </template>
  </UCard>
</template>
