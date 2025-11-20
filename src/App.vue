<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header class="bg-white border-b border-slate-200">
      <div class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <RouterLink
          to="/"
          class="text-xl font-semibold text-slate-900 transition-colors hover:text-brand-600"
        >
          Transport Shipment Tracker
        </RouterLink>
       
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-10">
      <RouterView />
    </main>
  </div>
</template>
