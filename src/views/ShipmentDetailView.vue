<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { type ShipmentStatus, useShipmentStore } from '@/stores/shipmentStore'

const shipmentStore = useShipmentStore()
const route = useRoute()
const router = useRouter()

const shipmentId = computed(() => String(route.params.id ?? ''))

const shipment = computed(() => shipmentStore.getShipmentById(shipmentId.value))
const { drivers: driverOptions } = storeToRefs(shipmentStore)
const selectedDriverId = ref('')
const assignmentAlert = ref<{ type: 'success' | 'error'; message: string } | null>(null)
const driverAlreadyAssigned = computed(() => Boolean(shipment.value?.driverId))

watch(
  () => shipmentId.value,
  (id) => {
    shipmentStore.selectShipment(id || null)
  },
  { immediate: true },
)

watch(
  shipment,
  (current) => {
    selectedDriverId.value = current?.driverId ?? ''
    assignmentAlert.value = null
  },
  { immediate: true },
)

// conditional class untuk status badge.
const statusBadgeClass = (status: ShipmentStatus) => {
  return status === 'Assigned'
    ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
    : 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const goBack = () => {
  router.push({ name: 'shipment-list' })
}

const assignDriver = () => {
  // jika tidak ada shipment maka tampilkan pesan shipment reference missing.
  if (!shipment.value) {
    assignmentAlert.value = { type: 'error', message: 'Shipment reference missing.' }
    return
  }
  // jika ada shipment maka assign driver ke shipment.
  const result = shipmentStore.assignDriver(shipment.value.id, selectedDriverId.value)
  // jika assign driver berhasil/gagal inject hasil kedalam state notifikasi assignmentAlert.
  assignmentAlert.value = {
    type: result.success ? 'success' : 'error',
    message: result.message,
  }
  if (!result.success) return
  selectedDriverId.value = shipment.value.driverId ?? selectedDriverId.value
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <button
          type="button"
          class="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
          @click="goBack"
        >
          ← Back to list
        </button>
        <p class="text-sm font-medium uppercase tracking-wide text-slate-500">Shipment Detail</p>
        <h1 class="text-3xl font-semibold text-slate-900">{{ shipment?.id ?? 'Unknown Shipment' }}</h1>
      </div>

      <div v-if="shipment" class="text-right">
        <p class="text-xs text-slate-500">Status</p>
        <span
          class="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold"
          :class="statusBadgeClass(shipment.status)"
        >
          {{ shipment.status }}
        </span>
      </div>
    </div>

    <div
      v-if="assignmentAlert"
      class="rounded-xl border px-4 py-3 text-sm"
      :class="
        assignmentAlert.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-rose-200 bg-rose-50 text-rose-900'
      "
    >
      {{ assignmentAlert.message }}
    </div>

     <template v-if="shipment"> 
      <!-- jika shipment ada maka tampilkan halaman detail shipment -->
      <div class="grid gap-6 lg:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 class="text-lg font-semibold text-slate-900">Route &amp; Timing</h2>
        <dl class="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Origin</dt>
            <dd class="text-base font-semibold text-slate-900">{{ shipment.origin }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Destination</dt>
            <dd class="text-base font-semibold text-slate-900">{{ shipment.destination }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Departure</dt>
            <dd class="text-base font-medium text-slate-900">{{ formatDate(shipment.departureDate) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">ETA</dt>
            <dd class="text-base font-medium text-slate-900">{{ formatDate(shipment.eta) }}</dd>
          </div>
        </dl>

      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Assignment</h2>
        <dl class="mt-6 space-y-4 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Carrier</dt>
            <dd class="text-base font-medium text-slate-900">
              {{ shipment.carrier || 'Carrier TBD' }}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Vehicle</dt>
            <dd class="text-base text-slate-900">{{ shipment.vehicle }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Driver</dt>
            <dd v-if="shipment.driverName" class="text-base text-slate-900">
              {{ shipment.driverName }}
              <p class="text-xs text-slate-500">{{ shipment.driverContact }}</p>
            </dd>
            <!-- jika tidak ada driver maka tampilkan pesan driver not yet assigned. -->
            <dd v-else class="text-base text-amber-600">Driver not yet assigned</dd>
          </div>
        </dl>

        <div class="mt-8 space-y-6">
          <div class="space-y-3">
            <label for="driver" class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Assign driver
            </label>
            <select
              id="driver"
              v-model="selectedDriverId"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-100"
              :disabled="driverAlreadyAssigned"
            >
              <option value="">Select a driver</option>
              <option v-for="driver in driverOptions" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
            <!-- jika driver sudah assigned maka tampilkan pesan driver already assigned. -->
            <p v-if="driverAlreadyAssigned" class="text-xs text-slate-500">
              Driver already assigned.
            </p>
            <button
              type="button"
              class="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              :disabled="!selectedDriverId || driverAlreadyAssigned"
              @click="assignDriver"
            >
              Assign Driver
            </button>
          </div>

          <button
            type="button"
            class="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            @click="goBack"
          >
            Close
          </button>
        </div>
        </article>
      </div>
    </template>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
      <p>We couldn’t find that shipment.</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-700"
        @click="goBack"
      >
        Return to Dashboard
      </button>
    </div>
  </section>
</template>

