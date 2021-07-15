<template>
    <div class="city-weather-container">
        <div class="weather-controls">
            <section class="left-controls">
                <div class="search-bar">
                 <input type="text" class="search-field" onkeypress="return /^[a-zA-Z\s]+$/.test(event.key)"
                    placeholder="Search Locations..." v-model="cityQuery" />
                 <button class="search-btn" @click="fetchWeather">Search</button>
                </div>
                <div v-if="errorMessage" class="input-errors"> {{ errorMessage }}</div>
                
            </section>

            <section class="right-controls">
                <button class="add-fvrts-btn" v-if="!isInFavorites" @click="storeLocationInFavoriteCities">&#9825; Add
                    To Favorites</button>
                <button class="rmv-btn" v-if="isInFavorites" @click="removeLocationFromFavoriteCities">Remove From
                    Favorites</button>
                <div class="favorite-indicator" v-if="isInFavorites">&#128154;Saved in favorites</div>
            </section>
        </div>
         
        <hr>

        <section class="main-weather-info">
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>
            <weather-item v-else-if="hasWeather" 
                :icon="getWeather.icon" 
                :cityname="getWeather.cityName"
                :weathertext="getWeather.WeatherText" :amount="getWeather.Temperature.Metric.Value"
                :unit="getWeather.Temperature.Metric.Unit"></weather-item>
            <div class="no-weather-block" v-else>The weather is not loaded yet..</div>
        </section>

        <div class="forecast-5-days" v-if="hasForeCast">
            <fore-cast-five-days 
                v-for="forecastItem in fetchForeCast" 
                :key="forecastItem.index"
                :date="forecastItem.Date" :unit="forecastItem.Temperature.Maximum.Unit"
                :amount="forecastItem.Temperature.Maximum.Value"></fore-cast-five-days>
        </div>
    </div>
</template>

<script>
    import WeatherItem from '../components/weather/WeatherItem.vue';
    import ForeCastFiveDays from '../components/weather/ForeCastFiveDays.vue';
    import {
        mapState
    } from 'vuex';

    export default {
        components: {
            WeatherItem,
            ForeCastFiveDays,
        },
        data() {
            return {
                isLoading: false,
                isInFavorites: false,
                defaultLocationAPI: 215854,
                currentLocationAPI: 215854,
                defaultLocationCity: 'Tel Aviv',
                cityName: '',
                TemperatureUnit: 'Metric',
                cityQuery: '',
                APIkey: 'KWM5jZQwAi8lfyrJkK9BfGOSNTAxlXfC',
                //APIkey: '1BAKSQ0qyJYiMpAP4liSrutHJRd5a9zE',
                locationsStorageName: 'storedLocations',
                favoritesStorageName: 'storedFavoriteCities',
                errorMessage: null,
                location: null,
                gettingLocation: false,
                errorStr: null,
                testLocation: {
                    "LocalObservationDateTime": "2021-07-06T10:45:00+03:00",
                    "EpochTime": 1625557500,
                    "WeatherText": "Mostly sunny",
                    "WeatherIcon": 2,
                    "HasPrecipitation": false,
                    "PrecipitationType": null,
                    "IsDayTime": true,
                    "Temperature": {
                        "Metric": {
                            "Value": 31,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Imperial": {
                            "Value": 86,
                            "Unit": "F",
                            "UnitType": 18
                        }
                    },
                },
            }
        },
        methods: {
            checkIfInFavorites() {
                if (localStorage.getItem(this.favoritesStorageName) !== null) {
                    const locationName = this.cityName;
                    const storedFavorites = JSON.parse(localStorage.getItem(this.favoritesStorageName));

                    if (storedFavorites && storedFavorites.length > 0) {
                        return storedFavorites.some((el) => {
                            return el.locationName === locationName;
                        });
                    }
                }
                return false;
            },
            storeLocationInFavoriteCities() {
                const locationName = this.cityName;
                const storageName = this.favoritesStorageName;

                if (localStorage.getItem(storageName) === null) {
                    const favoriteItemsArr = [];
                    localStorage.setItem(storageName, JSON.stringify(favoriteItemsArr));
                }

                let favoriteItem = {
                    "location": locationName.replace(' ', '_').toLowerCase(),
                    "locationName": locationName,
                    "id": this.currentLocationAPI
                }

                const storedFavorites = JSON.parse(localStorage.getItem(storageName));

                if (storedFavorites && storedFavorites.length > 0) {
                    const index = storedFavorites.findIndex(item => item.locationName === locationName);
                    if (index === -1) {
                        storedFavorites.push(favoriteItem);
                        localStorage.setItem(storageName, JSON.stringify(storedFavorites));

                        this.isInFavorites = this.checkIfInFavorites();

                    }
                } else {
                    storedFavorites.push(favoriteItem);
                    localStorage.setItem(storageName, JSON.stringify(storedFavorites));
                    this.isInFavorites = this.checkIfInFavorites();
                }
            },
            removeLocationFromFavoriteCities() {
                if (localStorage.getItem(this.favoritesStorageName) !== null) {
                    const locationName = this.cityName ? this.cityName : this.defaultLocationCity;
                    const storageName = this.favoritesStorageName;

                    const storedFavorites = JSON.parse(localStorage.getItem(storageName));

                    if (storedFavorites && storedFavorites.length > 0) {
                        const index = storedFavorites.findIndex(item => item.locationName === locationName);
                        if (index !== -1) {
                            const filteredFavorites = storedFavorites.filter(item => item.locationName !==
                            locationName);
                            localStorage.setItem(storageName, JSON.stringify(filteredFavorites));

                            this.isInFavorites = this.checkIfInFavorites();
                        }
                    }
                }
            },
            storeLocationsInLocalStorage(city, locationApi) {
                if (localStorage.getItem(this.locationsStorageName) === null) {
                    let locationItemsArr = [];
                    localStorage.setItem(this.locationsStorageName, JSON.stringify(locationItemsArr));
                }

                let locationItem = {
                    "location": city,
                    "locationApi": locationApi,
                }

                const storedLocations = JSON.parse(localStorage.getItem(this.locationsStorageName));

                if (storedLocations.length > 0) {
                    const index = storedLocations.findIndex(item => item.locationApi === locationApi);
                    if (index === -1) {
                        storedLocations.push(locationItem);
                        localStorage.setItem(this.locationsStorageName, JSON.stringify(storedLocations));
                    }
                } else {
                    storedLocations.push(locationItem);
                    localStorage.setItem(this.locationsStorageName, JSON.stringify(storedLocations));
                }
            },
            loadLocationInfo(locationCity) {
                return this.$store.dispatch('weather/loadLocationInfo', {
                    location: locationCity,
                    keyApi: this.APIkey
                });
            },
            loadWeather(locationApi) {
                this.isLoading = true;
                this.$store.dispatch('weather/loadWeather', {
                    api: locationApi,
                    keyApi: this.APIkey
                });
                this.isLoading = false;
            },
            loadForeCast(locationApi) {
                this.$store.dispatch('weather/loadForeCast', {
                    api: locationApi,
                    keyApi: this.APIkey
                });
            },
            fetchWeather() {
                this.errorMessage = '';
                let locationCity = this.cityQuery;
                let locationApi = null;

                if (locationCity.trim().length < 1 || locationCity.toLowerCase() === (this.defaultLocationCity)
                    .toLowerCase()) {
                    this.errorMessage = 'The field is empty or contains incorrect characters';
                    return;
                }

                //Check if locationAPI is stored in 'localStorage' by city name.          
                if (localStorage.getItem(this.locationsStorageName) !== null) {

                    const storedLocations = JSON.parse(localStorage.getItem(this.locationsStorageName));

                    if (storedLocations.length > 0) {
                        storedLocations.some((el) => {
                            if (el.location && el.location.toLowerCase() === locationCity.toLowerCase()) {
                                locationApi = el.locationApi;
                                this.cityName = el.location;
                            }
                        });
                    }
                }

                if (!locationApi) {
                    this.loadLocationInfo(locationCity)
                        .then(res => {
                            if (res.data && res.data.length > 0) {
                                const locationInfo = this.locationInfo;
                                locationApi = locationInfo.Key;
                                this.cityName = locationInfo.LocalizedName;

                                this.loadWeather(locationApi);
                                this.loadForeCast(locationApi);

                                this.currentLocationAPI = locationApi;
                                this.isInFavorites = this.checkIfInFavorites();

                                //Save location info in localstorage
                                if (locationInfo.LocalizedName && locationInfo.Key) {
                                    this.storeLocationsInLocalStorage(locationInfo.LocalizedName, locationInfo.Key);
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    this.loadWeather(locationApi);
                    this.loadForeCast(locationApi);

                    this.currentLocationAPI = locationApi;
                    this.isInFavorites = this.checkIfInFavorites();
                }
            },
            initWeatherData() {
                    if (this.$route.query.locationId && this.$route.query.locationName) {
                        this.loadWeather(this.$route.query.locationId); 
                        this.loadForeCast(this.$route.query.locationId);

                        this.cityName = this.$route.query.locationName;
                        this.currentLocationAPI = this.$route.query.locationId; 
                    }  else {
                        this.loadWeather(this.defaultLocationAPI);
                        this.loadForeCast(this.defaultLocationAPI); 

                        this.cityName = this.defaultLocationCity;
                        this.currentLocationAPI = this.defaultLocationAPI; 
                    } 
                   this.isInFavorites = this.checkIfInFavorites();       
            },
            // toggleUnits() {
            //     if (this.TemperatureUnit !== "Imperial") {
            //      this.TemperatureUnit = "Imperial";
            //     } else {
            //      this.TemperatureUnit = "Metric";
            //     }
            // },     
        },
        computed: {
            ...mapState({
                getError: 'error',
            }),
            getWeather() {
                const weather = this.$store.getters['weather/getWeather'];

                let cityName = this.cityName;

                let iconNumber = weather.WeatherIcon;
                if (iconNumber < 10) {
                    iconNumber = '0' + iconNumber;
                }
                const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;

                weather.cityName = cityName;
                weather.icon = iconUrl;

                return weather;
            },
            locationInfo() {
                return this.$store.getters['weather/getLocationInfo'];
            },
            fetchForeCast() {
                const forecastObj = this.$store.getters['weather/getForeCast'];
                return forecastObj;
            },
            hasWeather() {
                return !this.isLoading && this.$store.getters['weather/hasWeather'];
            },
            hasForeCast() {
                return this.$store.getters['weather/hasForeCast'];
            },
        },
        created() {
            this.initWeatherData();
        },
    }
</script>

<style scoped>
   .city-weather-container {
        margin: 0 auto;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 5px rgb(0 0 0 / 20%);
    }

    .main-weather-info {
        margin: 12px auto;
        background: #f4f4f5;
        border: 1px solid #dcdfe6;
        border-color: #d3d4d6;
        border-radius: 4px;
        padding: 14px 15px;
    }
    .weather-controls {
        display: flex;
        justify-content: space-between;
    }
    .left-controls .search-bar{
       display: flex;
    }
    .left-controls .search-bar .search-field{
        width: 250px;
        margin: 0px;
        padding-left: 10px;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 100;
        font-style: italic;
        border: solid 1px;
        background: #f4f4f5;
        border-color: #d3d4d6;
        border-radius: 2px;
        background-color: aliceblue;
    }
    .left-controls .search-bar .search-field::placeholder{
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #a0a2a7;
        opacity: 1; /* Firefox */
        }
        :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #a0a2a7;
        }
        ::-ms-input-placeholder { /* Microsoft Edge */
        color: #a0a2a7;
    }
    .left-controls .search-bar .search-btn {
        border: none;
        border-radius: 2px;
        padding: 6px 14px;
        font-size: 14px;
        color: #ffffff;
        background-color: #409eff;
        border-color: #409eff;
        cursor: pointer;
        margin-left: 10px;
        cursor: pointer;
    }
    .right-controls{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .forecast-5-days {
        display: flex;
        justify-content: space-between;
    }

    .no-weather-block {
        margin: 20px auto;
        padding: 38px;
        text-align: center;
        color: #e6a23c;
        background: #fdf6ec;
        border: solid 1px;
        border-color: #f5dab1;
        border-radius: 2px;
    }

    .favorite-indicator {
        color: #00ad00;
    }

    .add-fvrts-btn {
        height: 28px;
        border: none;
        border-radius: 4px;
        padding: 0px 14px;
        font-size: 14px;
        color: #fff;
        background-color: #67c23a;
        border-color: #67c23a;
        cursor: pointer;
    }

    .rmv-btn {
        height: 28px;
        border: none;
        border-radius: 4px;
        padding: 6px 14px;
        font-size: 14px;
        color: #ffffff;
        background-color: #f56c6c;
        cursor: pointer;
    }

    hr {
        border: 0;
        height: 0;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .input-errors {
        color: #f56c6c;
        padding: 5px 5px;
        background: #fef0f0;
        border: 1px solid;
        border-color: #fbc4c4;
        border-radius: 2px;
        font-size: 12px;
        margin-top: 6px;
    }

    /****************** Mobile ******************/
    @media only screen and (max-width: 1024px) {
       .weather-controls {
        flex-direction: column;
       }
       .city-weather-container{
        box-shadow: none;
       }
       .left-controls{
           margin-bottom: 20px;
       }
       .left-controls .search-bar[data-v-17092b4e] {
        display: flex;
        flex-direction: column;
       }
       .left-controls .search-bar .search-field{
           width: 100%;
           height: 36px;
           margin-bottom: 10px;
           font-size: 16px;
       }
       .left-controls .search-bar .search-btn{
           margin-left: 0px;
           font-size: 19px;
       }
       .forecast-5-days{
           flex-direction: column;
       }
       .forecast-item{
         width: 100%;
         margin-bottom: 10px;
       }
    }
</style>