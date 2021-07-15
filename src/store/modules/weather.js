import axios from 'axios';

export default {
    namespaced: true,
    state() {
      return {      
        locationInfo: {},
        error: '',
        weatherData: {},
        forecastFiveDaysData: {},
      };
    },
    mutations: {
     setLocationInfo(state, payload) {
      state.locationInfo = payload;
     },
     setWeather(state, payload) {
      state.weatherData = payload;
     },
     setForeCast(state, payload) {
        state.forecastFiveDaysData = payload;
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
            
            const locationInfoResponse = res.data[0];
            context.commit('setLocationInfo', locationInfoResponse);
           }
           return res;
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
            const responseDataWeather = res.data[0];
            context.commit('setWeather', responseDataWeather);
          }
          return true;
        })
        .catch(error => console.log(error.message)); 
      },
     async loadForeCast(context, data) {
      const locationApi = data.api;
      try {
        const foreCastUrl = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';                        
        const locationInfoUrlWithParams = `${foreCastUrl}${locationApi}?apikey=${data.keyApi}&metric=true`;
        const responseLocationInfo = await fetch(locationInfoUrlWithParams);
        const responseDataLocationInfo = await responseLocationInfo.json();
        
        const locationInfoResponse = responseDataLocationInfo.DailyForecasts;
        
        context.commit('setForeCast', locationInfoResponse);
      } catch(e) {
        console.log(e);
      }
     
     }
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
     hasWeather(state) {
      return state.weatherData && Object.keys(state.weatherData).length !== 0;
     },
     getForeCast(state) {
      return state.forecastFiveDaysData;
     },
     hasForeCast(state) {
      return state.forecastFiveDaysData && state.forecastFiveDaysData.length > 0;
     },
    }
};