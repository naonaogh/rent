import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import LoginRegister from '../views/LoginRegister.vue';
import HomePage from '../views/HomePage.vue';
import AboutContact from '../views/AboutContact.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import UserAgreement from '../views/UserAgreement.vue';
// import OfferContract from '../views/OfferContract.vue';
import ProfileView from '../views/ProfileView.vue';
import RentForm from '../views/RentForm.vue';
import MyRequestsView from '../views/MyRequestsView.vue';
import MyContractsView from '../views/MyContractsView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import AllRequestsView from '../views/AllRequestsView.vue';
import AllContractsView from '../views/AllContractsView.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  {
    path: '/loginregister',
    name: 'loginregister',
    component: LoginRegister,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/allrequests',
    name: 'allrequests',
    component: AllRequestsView,
    meta: { requiresStaff: true }
  },
  {
    path: '/allcontracts',
    name: 'allcontracts',
    component: AllContractsView,
    meta: { requiresStaff: true }
  },
  {
    path: '/myrequests',
    name: 'my-requests',
    component: MyRequestsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mycontracts',
    name: 'my-contracts',
    component: MyContractsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/rent',
    name: 'rent',
    component: RentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/rent/:id',
    name: 'rent-machinery',
    component: RentForm,
    props: true,
    meta: { requiresAuth: true }
  },
  { path: '/about', name: 'AboutContact', component: AboutContact },
  { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/agreement', name: 'UserAgreement', component: UserAgreement },
  // { path: '/offer', name: 'OfferContract', component: OfferContract },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];
  const isManager = store.getters['auth/isManager'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/loginregister');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/');
  } else if (to.meta.requiresStaff && !(isAdmin || isManager)) {
    next('/');
  } else {
    next();
  }
});

export default router;