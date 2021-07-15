<template>
    <div :id="itemId" class="favorite-city" @click="goToDitails">
       <div class="fav-city-name">{{ cityname }}</div>
       
       <div class="fav-city-desc">{{ weathertext }}</div>
  
       <div class="fav-city-value">{{ amount }} {{ unitSymbol }}</div>
    </div>
</template>

<script>
export default {
   props: ['date', 'amount', 'unit', 'cityname', 'weathertext', 'id'],
   data() {
      return {
         itemId: this.id
      }
   },
   methods: {
      goToDitails() {
        this.$router.push({path:'/',query:{locationId: this.id, locationName: this.cityname }});
      }
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
 .favorite-city{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid;
    border-color: #d3d4d6;
    border-radius: 4px;
    width: 19%;
    height: 100px;
    text-align: center;
    cursor: pointer;
    margin: 0px 4px 10px 0px;
 }

 .fav-city-name{
   font-weight: 800;
   margin-bottom: 10px;
 }
 .fav-city-desc{
   margin-bottom: 10px;  
 }

 /****************** Mobile ******************/
    @media only screen and (max-width: 1024px) {
       .favorite-city{
          width: 100%;
       }
    }
</style>