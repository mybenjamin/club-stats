<script setup lang="ts">
const { players, summary, positionOptions, nationalityOptions } = usePlayerDashboard()

useSeoMeta({
  title: 'Club Stats Dashboard',
  description: 'Dark-first squad dashboard with sortable player cards, recent goal trends, and compare-ready club stats.',
  ogTitle: 'Club Stats Dashboard',
  ogDescription: 'Track squad output, form, and role distribution from a static club stats snapshot.',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <PlayerDashboard
    :players="players"
    :summary="summary"
    :position-options="positionOptions"
    :nationality-options="nationalityOptions"
  />
</template>
