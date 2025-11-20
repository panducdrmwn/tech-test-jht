import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useShipmentStore } from '../shipmentStore'

describe('useShipmentStore - assignDriver', () => {
  beforeEach(() => {
    // create a fresh Pinia instance for each test
    setActivePinia(createPinia())
  })

  it('assign driver to shipment success', () => {
    const store = useShipmentStore()

    // cari shipment yang tidak ada driver
    const unassignedShipment = store.shipments.find((s) => s.status === 'Not Assigned')
    expect(unassignedShipment).toBeDefined()

    // buat initial value dari shipment yang belum ada driver
    if (!unassignedShipment) return

    const shipmentId = unassignedShipment.id
    const initialStatus = unassignedShipment.status
    const initialDriverName = unassignedShipment.driverName

    // ambil driver dari data driver 
    const driver = store.drivers[0]
    expect(driver).toBeDefined()

    if (!driver) return

    // assign driver
    const result = store.assignDriver(shipmentId, driver.id)

    // verify success response
    expect(result.success).toBe(true)
    expect(result.message).toContain(driver.name)
    expect(result.message).toContain(shipmentId)

    // verify shipment telah update
    const updatedShipment = store.getShipmentById(shipmentId)
    expect(updatedShipment).toBeDefined()
    expect(updatedShipment?.driverId).toBe(driver.id)
    expect(updatedShipment?.driverName).toBe(driver.name)
    expect(updatedShipment?.driverContact).toBe(driver.contact)
    expect(updatedShipment?.status).toBe('Assigned')

    // verify status telah berganti dari initial state
    if (initialStatus !== 'Assigned') {
      expect(updatedShipment?.status).not.toBe(initialStatus)
    }

    // verify driver name telah berganti dari initial state
    if (initialDriverName !== driver.name) {
      expect(updatedShipment?.driverName).not.toBe(initialDriverName)
    }
  })

})

