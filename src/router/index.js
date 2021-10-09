import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    // --------- Home Page ------------
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
        requiresAuth: true
      },
    },

    // *--------- USER ---- ---------------------------------------*
    {
        path: '/apps/users/list',
        name: 'apps-users-list',
        component: () => import('@/views/apps/user/users-list/UsersList.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/apps/users/view/:id',
        name: 'apps-users-view',
        component: () => import('@/views/apps/user/users-view/UsersView.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/apps/users/edit/:id',
        name: 'apps-users-edit',
        component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
        meta: {
            requiresAuth: true
        },
    },
    
    // ------------- Login Page --------------
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },

    // ------------- Screening Offensive Contents ------------------
    {
      	path: '/screening/wordlist',
        name: 'badWordList',
        component: () => import('@/views/screening/WordList.vue'),
        meta: {
          requiresAuth: true
        }
    },

	// ------------- Chat History ------------------
    {
      path: '/chat',
      name: 'apps-chat',
      component: () => import('@/views/apps/chat/Chat.vue'),
      meta: {
        requiresAuth: true,
        contentRenderer: 'sidebar-left',
            contentClass: 'chat-application',
      }
    },

    // ------------- Chat History ------------------
    {
      path: '/transactions',
      name: 'transactionHistory',
      component: () => import('@/views/apps/transactions/TransactionHistory.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    
    // ------------- 404 Page ----------------
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// navigation guard
router.beforeEach(( to, from, next ) => {
  if( to.matched.some( record => record.meta.requiresAuth ) ) {
    if ( store.getters['auth/isAuthenticated'] ) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
