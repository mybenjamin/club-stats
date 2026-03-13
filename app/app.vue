<script setup lang="ts">
const themePresets = [
  {
    id: 'pitch-green',
    label: 'Pitch Green',
    primary: 'green',
    themeColor: '#052e16'
  },
  {
    id: 'sky-blue',
    label: 'Sky Blue',
    primary: 'blue',
    themeColor: '#082f49'
  },
  {
    id: 'gold-amber',
    label: 'Gold Amber',
    primary: 'amber',
    themeColor: '#451a03'
  },
  {
    id: 'rose-red',
    label: 'Rose Red',
    primary: 'rose',
    themeColor: '#4c0519'
  },
  {
    id: 'violet-night',
    label: 'Violet Night',
    primary: 'violet',
    themeColor: '#2e1065'
  }
] as const

type ThemePreset = (typeof themePresets)[number]
type ThemePresetId = ThemePreset['id']

const themeOptions = themePresets.map(theme => ({
  label: theme.label,
  value: theme.id
}))

const selectedThemeId = useCookie<ThemePresetId>('club-stats-theme', {
  default: () => 'rose-red'
})

const activeTheme = computed(() => {
  return themePresets.find(theme => theme.id === selectedThemeId.value) ?? themePresets[0]
})

watch(activeTheme, (theme) => {
  updateAppConfig({
    ui: {
      colors: {
        primary: theme.primary,
        neutral: 'slate'
      }
    }
  })
}, { immediate: true })

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: activeTheme.value.themeColor }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'dark',
    'data-theme': activeTheme.value.id
  }
}))

const title = 'Club Stats Dashboard'
const description = 'Dark-first player dashboard built with Nuxt UI and static club stats data.'

useSeoMeta({
  titleTemplate: `%s · ${title}`,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader class="border-b border-default/70 bg-black/10 backdrop-blur">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <UIcon
              name="i-lucide-chart-column-big"
              class="h-5 w-5"
            />
          </div>

          <div>
            <p class="text-sm font-semibold text-highlighted">
              Club Stats
            </p>
            <p class="text-xs uppercase tracking-[0.24em] text-muted">
              Player dashboard
            </p>
          </div>
        </NuxtLink>
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <USelect
            v-model="selectedThemeId"
            :items="themeOptions"
            value-key="value"
            color="primary"
            variant="outline"
            class="min-w-40"
          />

          <UBadge
            color="primary"
            variant="soft"
            class="rounded-full px-3 py-1"
          >
            {{ activeTheme.label }}
          </UBadge>
        </div>
      </template>
    </UHeader>

    <UMain class="pb-8">
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter class="border-t border-default/70 bg-black/10">
      <template #left>
        <p class="text-sm text-muted">
          Static club snapshot • Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UBadge
          color="neutral"
          variant="outline"
        >
          Prerender-ready data
        </UBadge>
      </template>
    </UFooter>
  </UApp>
</template>
