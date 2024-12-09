import { createRouter, createWebHistory } from 'vue-router'
import Password from '../views/password/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Password,
    },
  ],
})

export default router
