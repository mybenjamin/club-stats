<script setup lang="ts">
const props = defineProps<{
  trend: number[]
}>()

const bars = computed(() => {
  const maxValue = Math.max(...props.trend, 1)

  return props.trend.map((value, index) => ({
    value,
    isLatest: index === props.trend.length - 1,
    height: `${Math.max((value / maxValue) * 100, 12)}%`
  }))
})

const trendTotal = computed(() => props.trend.reduce((sum, value) => sum + value, 0))
</script>

<template>
  <div class="space-y-2">
    <div class="flex h-14 items-end gap-1">
      <div
        v-for="(bar, index) in bars"
        :key="`${index}-${bar.value}`"
        class="flex-1 rounded-full transition-all"
        :class="bar.isLatest ? 'bg-primary' : 'bg-primary/30'"
        :style="{ height: bar.height }"
      />
    </div>

    <div class="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted">
      <span>Last 10 matches</span>
      <span>{{ trendTotal }} goals</span>
    </div>
  </div>
</template>
