import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AboutContact from '../views/AboutContact.vue'
import UserAgreement from '../views/UserAgreement.vue'  
import PrivacyPolicy from '../views/PrivacyPolicy.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/aboutcontact',
    name: 'AboutContact',
    component: AboutContact 
  },
  {
    path: '/useragreement',  // Новый маршрут
    name: 'UserAgreement',
    component: UserAgreement  // Новый компонент
  },
  {
    path: '/privacypolicy',  // Новый маршрут
    name: 'PrivacyPolicy',
    component: PrivacyPolicy  // Новый компонент
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
