import axios from 'axios';

export default {
    namespaced: true,
    state() {
      return {      
        locationInfo: {},
        defaultLocationInfo: {},
        error: '',
        weatherData: {},
        forecastFiveDaysData: {},
      };
    },
    mutations: {
     setLocationInfo(state, payload) {
      state.locationInfo = payload;
     },
     setDefaultLocationInfo(state, payload) {
       state.defaultLocationInfo = payload;
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
      async loadLocationInfo(context, data) {
        const locationCity = data.location;
        const baseURL = 'https://dataservice.accuweather.com/';
        const autocompleteSearchUrl = 'locations/v1/cities/autocomplete';
        const locationInfoUrlWithParams = `${baseURL}${autocompleteSearchUrl}?apikey=${data.keyApi}&q=${locationCity}`;
        
        try {
          const res = await axios.get(locationInfoUrlWithParams);
          if (res.data.length) { 
            const locationInfoResponse = res.data[0];
            context.commit('setLocationInfo', locationInfoResponse);
            return locationInfoResponse;
           }
        } catch(err) {
           const error = new Error(err.message || 'Failed to fetch location Info!');
           throw error;
        }    
      },
      async loadDefaultLocationInfo(context, data) {
        const locationCoordinates = data.location;
        const baseURL = 'https://dataservice.accuweather.com/';
        const geopositionSearchUrl = 'locations/v1/cities/geoposition/search';
        const locationInfoUrlWithParams = `${baseURL}${geopositionSearchUrl}?apikey=${data.keyApi}&q=${locationCoordinates}`;
      
        try {
          const res = await axios.get(locationInfoUrlWithParams)
          const locationInfoResponse = res.data;
          context.commit('setDefaultLocationInfo', locationInfoResponse);
          return locationInfoResponse;
        } catch(err) {
          const error = new Error(err.message || 'Failed to fetch Default location Info!');
          throw error;
        }      
      },
      async loadWeather(context, data ) {   
        const locationApi = data.api;
        const baseURL = 'https://dataservice.accuweather.com/';
        const currentConditionsUrl = 'currentconditions/v1/';
        const weatherUrlWithParams = `${baseURL}${currentConditionsUrl}${locationApi}?apikey=${data.keyApi}`;
         
        try {
          const res = await axios.get(weatherUrlWithParams);         
          const responseDataWeather = res.data[0];
          context.commit('setWeather', responseDataWeather);

        } catch(err) {
          const error = new Error(err.message || 'Failed to fetch weather!');
          console.log(err);
          throw error;
        } 
      },
      async loadForeCast(context, data) {
       const locationApi = data.api;
       const foreCastUrl = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';                        
       const locationInfoUrlWithParams = `${foreCastUrl}${locationApi}?apikey=${data.keyApi}&metric=true`;

        try {
          const responseLocationInfo = await fetch(locationInfoUrlWithParams);
          const responseDataLocationInfo = await responseLocationInfo.json();
          
          const locationInfoResponse = responseDataLocationInfo.DailyForecasts;
          
          context.commit('setForeCast', locationInfoResponse);
        } catch(err) {
           const error = new Error(err.message || 'Failed to fetch forecast!');
           console.log(err);
           throw error;
        }   
     }
    },
    getters: {
     getLocationInfo(state) {
      return state.locationInfo;
     },
     getDefaultLocationInfo(state) {
      return state.defaultLocationInfo;
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