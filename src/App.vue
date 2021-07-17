<template>
 <div class="main-container">
  <the-header></the-header>
   <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
   </router-view>
  </div>
</template>

<script>
import TheHeader from './components/nav/TheHeader.vue';

export default {
   components: {
    TheHeader
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
}

body {
  margin: 0;
}
.main-container{
  max-width: 80%;
  margin: 0 auto;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/****************** Mobile ******************/
    @media only screen and (max-width: 1024px) {
       .main-container {
        max-width: 100%; 
       }
    }
    /* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {

}
</style>