import { createStore } from 'vuex';

import weatherModule from './modules/weather.js';
import favoritesModule from './modules/favorites.js';


const store = createStore({
  modules: {
    weather: weatherModule,
    favorites: favoritesModule
  },
  state() {},
  mutations: {},
  actions: {},
  getters: {}
});

export default store;