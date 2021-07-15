import { createRouter, createWebHistory } from 'vue-router';

import WeatherMain from './pages/WeatherMain.vue';
import FavoriteWeather from './pages/FavoriteWeather.vue'
import NotFound from './pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
   
    { path: '/', component: WeatherMain },
    { path: '/favorite_weather', component: FavoriteWeather },
    { path: '/:pathMatch(.*)*', name: 'Not Found', component: NotFound }
  ]
});

export default router;