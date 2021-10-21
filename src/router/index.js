import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/views/Login.vue');
const Table = () => import('@/views/Table.vue');
const Home = () => import('@/views/Home.vue');
const Payment = () => import('@/views/Payment.vue');
const ListOrdered = () => import('@/views/ListOrdered.vue');
const Print = () => import('@/views/Print.vue');
const PaymentReview = () => import('@/views/PaymentReview.vue');
const ListCustomer = () => import('@/views/ListCustomer.vue');
const NewCustomer = () => import('@/views/NewCustomer.vue');
const ReloadDetails = () => import('@/views/ReloadDetails.vue');
const RetourDetails = () => import('@/views/RetourDetails.vue');
const Bericht = () => import('@/views/Bericht.vue');
const ListOrderedChef = () => import('@/views/ListOrderedChef.vue');
const DetailOrderedChef = () => import('@/views/DetailOrderedChef.vue');

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/list-ordered',
      name: 'ListOrdered',
      component: ListOrdered,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/print',
      name: 'Print',
      component: Print,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/payment-review',
      name: 'PaymentReview',
      component: PaymentReview,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/list-customer',
      name: 'ListCustomer',
      component: ListCustomer,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/new-customer',
      name: 'NewCustomer',
      component: NewCustomer,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/reload-details/:id',
      name: 'ReloadDetails',
      component: ReloadDetails,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/retour-details/:id',
      name: 'RetourDetails',
      component: RetourDetails,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/bericht',
      name: 'Bericht',
      component: Bericht,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/list-orderedchef',
      name: 'ListOrderedChef',
      component: ListOrderedChef,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/detail-orderedchef',
      name: 'DetailOrderedChef',
      component: DetailOrderedChef,
      meta: {
        requiresAuth: true,
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = localStorage.getItem('login');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next({
        path: '/'
      });
    } else {
      next();
    }
  } else {
    if (to.meta.redirectIfAuth && user) {
      next({ name: to.meta.redirectIfAuth});
    } else {
      next();
    }
  }
})

export default router
