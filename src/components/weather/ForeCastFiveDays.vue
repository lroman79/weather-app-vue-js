<template>
   <div class="forecast-item">
       <div class="week-day-name">
        {{ weekDayName }}
       </div>
       <div class="air-tempr">
          {{ amount }} {{ unitSymbol }}
       </div>
       <div>
       
       </div>
   </div>
</template>

<script>
export default {
    props: ['date', 'amount', 'unit'],
    computed: {
     weekDayName() {
         let date = new Date(this.date);
         const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
         const dayNumber = date.getDay();
         const dayName = weekDays[dayNumber];
         return dayName;
     },
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
 .forecast-item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 19%;
    min-height: 100px;
    text-align: center;
    border: 1px solid;
    border-color: #d3d4d6;
    border-radius: 4px;
 }

 .week-day-name{
     margin-bottom: 10px;
 }
</style>