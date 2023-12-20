<script setup>
import { RouterLink, RouterView } from 'vue-router'
import taiwanmap from './components/icons/taiwanmap.vue'
import search from './components/icons/CustomInput.vue'
</script>

<template>
  <RouterView />
</template>

<style>
body{
  background-color: rgb(66, 65, 65);
}
#app {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0;
    font-weight: normal;
}
.leftsearch{
position: relative;
  width: 60%;
  min-height: 100vh;
  /* background-color: aliceblue; */
}
.rughtmap{
  width: calc(100% - 60%);
  padding-right: 0.5rem;
}
svg{
  width: 100%;
  padding-right: 2rem;
}
.search{
  position: absolute;
  top: 1%;
  left: 35%;
  width: 250px;
  height: 40px;
}
</style>
