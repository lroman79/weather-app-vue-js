import axios from 'axios';

export default {
    namespaced: true,
    state() {
      return {      
        locationInfo: {},
        error: '',
        weatherData: {},
      };
    },
    mutations: {
     setLocationInfo(state, payload) {
      state.locationInfo = payload;
     },
     setWeather(state, payload) {
      state.weatherData = payload;
     },
     error(state, data) {
      return state.error = data;
     },
    },
    actions: {
      loadLocationInfo(context, data) {
        const locationCity = data.location;
        const baseURL = 'https://dataservice.accuweather.com/';
        const autocompleteSearchUrl = 'locations/v1/cities/autocomplete';

        const locationInfoUrlWithParams = `${baseURL}${autocompleteSearchUrl}?apikey=${data.keyApi}&q=${locationCity}`;
      
        return axios.get(locationInfoUrlWithParams)
         .then(res => {
           if (res) {
            const [locationInfoResponse] = res.data;
            context.commit('setLocationInfo', locationInfoResponse);
            //console.log('Location is loaded: from Vuex: ' + JSON.stringify(context.state.locationInfo));
           }
           return true;
         })
         .catch(error => console.log(error.message));      
      },
      loadWeather(context, data ) {
    
        const locationApi = data.api;
        const baseURL = 'https://dataservice.accuweather.com/';
        const currentConditionsUrl = 'currentconditions/v1/';
        const weatherUrlWithParams = `${baseURL}${currentConditionsUrl}${locationApi}?apikey=${data.keyApi}`;

        return axios.get(weatherUrlWithParams)
        .then(res => {
          if (res) {
            const [responseDataWeather] = res.data;
            context.commit('setWeather', responseDataWeather);
          }
          return true;
        })
        .catch(error => console.log(error.message)); 
      },
    },
    getters: {
     getLocationInfo(state) {
      return state.locationInfo;
     },
     hasLocationInfo(state) {
      return state.locationInfo;
     },
     getWeather(state) {
      return state.weatherData;
     },
    }
};