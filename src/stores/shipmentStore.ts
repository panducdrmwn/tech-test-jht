import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import shipmentsJson from '@/data/shipments.json'

export type ShipmentStatus = 'Assigned' | 'Not Assigned'

export interface Driver {
  id: string
  name: string
  contact: string
  region: string
  equipment: string
}

export interface Shipment {
  id: string
  origin: string
  destination: string
  status: ShipmentStatus
  carrier: string
  vehicle: string
  driverId?: string
  driverName: string
  driverContact: string
  departureDate: string
  eta: string
  cargo: string
}

export const useShipmentStore = defineStore('shipmentStore', () => {
  const shipmentsData = shipmentsJson as { shipments: Shipment[]; drivers: Driver[] }
  const shipments = ref<Shipment[]>(shipmentsData.shipments.map((shipment) => ({ ...shipment })))
  const drivers = ref<Driver[]>(shipmentsData.drivers.map((driver) => ({ ...driver })))
  const selectedShipmentId = ref<string | null>(null)

  const assignedCount = computed(
    () => shipments.value.filter((shipment) => shipment.status === 'Assigned').length,
  )
  const unassignedCount = computed(
    () => shipments.value.filter((shipment) => shipment.status === 'Not Assigned').length,
  )

  const getShipmentById = (id: string) => shipments.value.find((shipment) => shipment.id === id)
  const getDriverById = (id: string) => drivers.value.find((driver) => driver.id === id)

  const selectedShipment = computed(() => {
    if (!selectedShipmentId.value) return null
    return getShipmentById(selectedShipmentId.value) ?? null
  })

  const selectShipment = (id: string | null) => {
    selectedShipmentId.value = id
  }

  const assignDriver = (shipmentId: string, driverId: string) => {
    const shipment = getShipmentById(shipmentId)
    if (!shipment) {
      return { success: false, message: 'Shipment not found.' }
    }

    const driver = getDriverById(driverId)
    if (!driver) {
      return { success: false, message: 'Driver not found.' }
    }

    shipment.driverId = driver.id
    shipment.driverName = driver.name
    shipment.driverContact = driver.contact
    shipment.status = 'Assigned'

    return { success: true, message: `${driver.name} assigned to ${shipment.id}.` }
  }

  return {
    shipments,
    drivers,
    assignedCount,
    unassignedCount,
    selectedShipment,
    selectShipment,
    getShipmentById,
    assignDriver,
  }
})

