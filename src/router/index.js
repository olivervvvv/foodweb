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
      path: '/PostPage',
      name: 'PostPage',
      component: () => import('../views/PostPage.vue'),
      children: [
        {
          path: '/PostFront',
          name:'PostFront',
          component: () => import('../components/PostGroup/PostFront.vue')
        },
        {
          path: '/PostRank',
          name:'PostRank',
          component: () => import('../components/PostGroup/PostRank.vue')
        },
      ]
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
    {
      path: '/post',
      name: 'post',
      component: () => import('../components/icons/Post.vue')
    },
    {
      path: '/20POST',
      name: '20POST',
      component: () => import('../views/20POST.vue')
<<<<<<< HEAD
=======
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/sally/Login.vue')
>>>>>>> 186227f667f5ac4fecc38c4fd0c9d65d3b259c62
    }
    
  ]
})

export default router
