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
      path: '/test',
      name: 'test',
      component: () => import('../components/yifeng/test.vue')
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

      component: () => import('../components/Gavin/20POST.vue')
    },
    {
      path: '/AddStore',
      name: 'AddStore',
      component: () => import('../components/Gavin/AddStore.vue')
    },
    {
      path: '/createPost',
      name: 'createPost',
      component: () => import('../components/tong/createPost.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/tong/register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/sally/Login.vue')
    },
    {
      path: '/storePage',
      name: 'storePage',
      component: () => import('../components/sally/StorePage.vue')
    },
    {
      path: '/postPage1/:storeId',
      name: 'postPage1',
      component: () => import('../components/sally/PostPage1.vue')
    },
    {
      path: '/postView',
      name: 'postView',
      component: () => import('../components/Gavin/postView.vue')
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: () => import('../components/sally/UserInfo.vue')
    },
    {
      path: '/newPost',
      name: 'newPost',
      component: () => import('../components/oliver/newPost.vue')
    },
    {
      path: '/OliverUpdatePosts',
      name: 'OliverUpdatePosts',
      component: () => import('../components/oliver/OliverUpdatePosts.vue')
    },
    {
      path: '/userPost',
      name: 'userPost',
      component: () => import('../components/sally/UserPost.vue')
    },
    {
      path: '/HeadshotUpdate',
      name: 'HeadshotUpdate',
      component: () => import('../components/oliver/HeadshotUpdate.vue')
    },
    
  ]
})

export default router
