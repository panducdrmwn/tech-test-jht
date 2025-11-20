<script setup lang="ts">

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { type ShipmentStatus, useShipmentStore } from '@/stores/shipmentStore'

const shipmentStore = useShipmentStore()
const { shipments } = storeToRefs(shipmentStore)
const router = useRouter()


const statusBadgeClass = (status: ShipmentStatus) => {
  return status === 'Assigned'
    ? 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200'
    : 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200'
}

const viewShipment = (id: string) => {
  shipmentStore.selectShipment(id)
  router.push({ name: 'shipment-detail', params: { id } })
}
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-1">
    
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">Shipment Dashboard</h1>
     
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Current Shipments</h2>
        </div>
        <span class="text-xs font-medium uppercase tracking-wider text-slate-400">Live</span>
      </div>

      <!-- Jika tidak ada shipment maka tampilkan pesan no shipments available yet. -->
      <div v-if="shipments.length === 0" class="px-6 py-16 text-center text-slate-500">
        No shipments available yet.
      </div>

      <div v-else class="overflow-x-auto">
      <!-- jika ada shipment maka tampilkan tabel shipment dengan id, route, status, carrier, dan actions. -->
        <table class="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-6 py-3 font-medium">Shipment ID</th>
              <th class="px-6 py-3 font-medium">Route</th>
              <th class="px-6 py-3 font-medium">Status</th>
              <th class="px-6 py-3 font-medium">Carrier</th>
              <th class="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-for="shipment in shipments" :key="shipment.id" class="hover:bg-slate-50">
              <!-- loop semua data shipment untuk isi tabel -->
              <td class="px-6 py-4 font-semibold text-slate-900">{{ shipment.id }}</td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ shipment.origin }}</p>
                <p class="text-xs text-slate-500">→ {{ shipment.destination }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusBadgeClass(shipment.status)"
                >
                  {{ shipment.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">
                  {{ shipment.carrier || 'Carrier TBD' }}
                </p>
                <p class="text-xs text-slate-500">{{ shipment.vehicle }}</p>
                <p class="text-xs text-slate-400">
                  Driver:
                  <span class="font-medium text-slate-600">
                    {{ shipment.driverName || 'Pending assignment' }}
                  </span>
                </p>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  class="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black shadow-sm transition hover:bg-brand-700"
                  @click="viewShipment(shipment.id)"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

