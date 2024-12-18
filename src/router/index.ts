import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'
import Password from '../views/password/index.vue'
import Game from '../views/game/index.vue'
import Gpt from '../views/gpt/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/encrypt',
      name: 'encrypt',
      component: Password,
    },
    {
      path: '/fish',
      name: 'fish',
      component: Game,
    },
    {
      path: '/gpt',
      name: 'gpt',
      component: Gpt,
    },
  ],
})

export default router
