<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#020617' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'dark'
  }
})

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
        <UBadge
          color="primary"
          variant="soft"
          class="rounded-full px-3 py-1"
        >
          Dark mode locked
        </UBadge>
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
