<template>
    <h2 class="weather-title">Weather Info</h2>
      <div class="weather-data-sec">
        <div class="city-temperature-info">
          <div class="weather-img">
            <img :src="icon" alt="">
          </div>
          <div>
            <div class="current-city">{{ cityname }}</div>
            <div class="today-temperature">
              <span class="tmpr-amount">{{ amount }}</span>
              <span class="tmpr-unit">{{ unitSymbol }}</span>
            </div>
          </div>
        </div>
        <!-- <div>
          <button @click="toggleUnits">Change Units</button>
        </div> -->
      </div>
      <h2 class="weather-text">{{ weathertext }}</h2>
</template>

<script>
  export default {
    props: ['amount', 'unit', 'cityname', 'icon', 'weathertext'],
    methods: {
      // toggleUnits() {
      //   this.$emit('toggle-units');
      // }
    },
    computed: {
      unitSymbol() {
        let unit = '℃';
        if (this.unit === 'F') {
         unit = '℉';
        }
        return unit;
     }
    }
  }
</script>

<style scoped>

  section{
    width: 80%;
    margin: 0 auto;

  }
  .weather-data-sec {
    display: flex;
    justify-content: center;
  }

  .city-temperature-info {
    display: flex;
    align-items: center;
  }
  .weather-title{
    text-align: center;
    color:#3e78d2;
  }
  .weather-text{
    text-align: center;
    color: #828993;
  }
</style>