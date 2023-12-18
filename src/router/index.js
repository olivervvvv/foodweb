import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/testOliver',
      name: 'testOliver',
      component: () => import('../components/oliver/testOliver.vue')
    },
    {
      path: '/test2',
      name: 'test2',
      component: () => import('../components/oliver/test2.vue')
    },
      path: '/post',
      name: 'post',
      component: () => import('../components/icons/Post.vue')
    }
    
  ]
})

export default router
