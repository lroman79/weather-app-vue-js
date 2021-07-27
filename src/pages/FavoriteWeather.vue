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
        <div class="empty-favorites-sec" v-else>No Favorite Weather found!</div>
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
            favoritesStorageName: 'storedFavoriteCities',
            APIkey: 'KWM5jZQwAi8lfyrJkK9BfGOSNTAxlXfC',
            //APIkey: '1BAKSQ0qyJYiMpAP4liSrutHJRd5a9zE',
        }
    },
    methods: {
        loadWeather(locationApi) {             
            return this.$store.dispatch('favorites/loadWeather', { api: locationApi, keyApi: this.APIkey });                                  
        },
        setWeatherArr() { 
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
         return new Promise((resolve, reject) => {
            if (localStorage.getItem(this.favoritesStorageName) !== null) {

              const storedFavoritesArr = JSON.parse(localStorage.getItem(this.favoritesStorageName));

              if (storedFavoritesArr && storedFavoritesArr.length > 0) {
                this.storedLocationsArr = storedFavoritesArr;
                resolve();                                      
              }   
            } else {
                reject(new Error('No favorites found!'));
            }
         });               
        },
        async initFavoriteWeather() {
         try {
          await this.getLocationsFromLocalStorage();
          this.setWeatherArr();
         } catch(err) {
            console.log(err);
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
     this.initFavoriteWeather();
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