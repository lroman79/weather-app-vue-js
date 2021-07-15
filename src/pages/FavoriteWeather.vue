<template>
<div class="fvorites-container">
    <section>
        <h3 class="favorite-title">Favorite Weather</h3>
             
        <div class="favorite-item-wrp" v-if="hasFavoriteLocations">  
            <favorite-city
                v-for="favoriteItem in favoriteItems"
                :key="favoriteItem.index"
                :id="favoriteItem.id"
                :weathertext="favoriteItem.WeatherText"
                :cityname="favoriteItem.cityName"
                :date="favoriteItem.LocalObservationDateTime"
                :unit="favoriteItem.Temperature.Metric.Unit"
                :amount="favoriteItem.Temperature.Metric.Value"
            ></favorite-city>
        </div>
        <div class="empty-favorites-sec" v-else>No favorite Weather!</div>
    </section>
   </div>
</template>

<script>
 import FavoriteCity from '../components/weather/FavoriteCity.vue';

export default {
    components: {
        FavoriteCity
    },
    data() {
        return {
            storedLocationsArr: [],
            weatherArr: [],
            // weatherArr: [
            //     {
            //     'EpochTime': 1626159240,
            //     'HasPrecipitation': false,
            //     'IsDayTime': false,
            //     'Link': "http://www.accuweather.com/en/ca/toronto/m5h/current-weather/55488?lang=en-us",
            //     'LocalObservationDateTime': "2021-07-13T02:54:00-04:00",
            //     'MobileLink': "http://www.accuweather.com/en/ca/toronto/m5h/current-weather/55488?lang=en-us",
            //     'PrecipitationType': null,
            //     "Temperature": {
            //         "Metric": {
            //             "Value": 30,
            //             "Unit": "C",
            //             "UnitType": 17
            //         },
            //         "Imperial": {
            //             "Value": 86,
            //             "Unit": "F",
            //             "UnitType": 18
            //         }
            //     },
            //     'WeatherIcon': 38,
            //     'WeatherText': "Mostly cloudy",
            //     'cityName': "Toronto",
            //     'id': "toronto"
            //     }
            // ],
            favoritesStorageName: 'storedFavoriteCities',
            APIkey: 'KWM5jZQwAi8lfyrJkK9BfGOSNTAxlXfC',
            //APIkey: '1BAKSQ0qyJYiMpAP4liSrutHJRd5a9zE',
        }
    },
    methods: {
        loadLocationInfo(locationCity) {           
            return this.$store.dispatch('favorites/loadLocationInfo', {location: locationCity, keyApi: this.APIkey});     
        },
        loadWeather(locationApi) {             
            return this.$store.dispatch('favorites/loadWeather', {api: locationApi, keyApi: this.APIkey});                                  
        },
        fillWeatherArr() { 
            const locationsArr = this.getFavoriteCities;
         
            if (locationsArr.length > 0 && locationsArr[0]) {
                locationsArr.forEach(item => {    
                
                    const locationObj = {};               
                    locationObj.cityName = item.locationName;
                    locationObj.id = item.id;

                    this.loadWeather(item.id)
                    .then(res => {
                        if (res) {
                        const weatherObj = this.getWeather;
                        const finalWeatherObj = { ...locationObj, ...weatherObj };
                        this.weatherArr.push(finalWeatherObj);
                        }
                    }) 
                    .catch( err => { console.log(err) });                            
                }); 
            }                     
        },
        getLocationsFromLocalStorage() {   

            if (localStorage.getItem(this.favoritesStorageName) !== null) {

              const storedFavoritesObj = JSON.parse(localStorage.getItem(this.favoritesStorageName));

              if (storedFavoritesObj && storedFavoritesObj.length > 0) {               
               this.storedLocationsArr = storedFavoritesObj;
              }   
            } 
        }
    },
    computed: {
        favoriteItems() {
            return this.weatherArr;
        },
        locationInfo () {
          return this.$store.getters['favorites/getLocationInfo'];
        },
        getWeather() { 
            const weather = this.$store.getters['favorites/getWeather'];
            return weather;
        },
        getFavoriteCities() {
            return this.storedLocationsArr;
        },
        hasFavoriteLocations() {
            return this.weatherArr && this.weatherArr.length > 0;
        }
    },
    created() {
       this.getLocationsFromLocalStorage();
       this.fillWeatherArr();
    }
}
</script>

<style scoped>
.favorite-title{
    text-align: center;
    color: #67c23a;
}
.fvorites-container{
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
}
.favorite-item-wrp{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.empty-favorites-sec{
    padding: 17px;
    text-align: center;
    color: #e6a23c;
    background: #fdf6ec;
    border: 1px solid;
    border-color: #f5dab1;
}

  /****************** Mobile ******************/
    @media only screen and (max-width: 1024px) {
        .fvorites-container{
         box-shadow: none;
        }
        .favorite-item-wrp{
            flex-direction: column;
            justify-content: center;
        }
    }

</style>