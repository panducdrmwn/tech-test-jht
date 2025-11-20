import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shipment-list',
      component: () => import('@/views/ShipmentListView.vue'),
    },
    {
      path: '/shipments/:id',
      name: 'shipment-detail',
      component: () => import('@/views/ShipmentDetailView.vue'),
    },
  ],
})

export default router
