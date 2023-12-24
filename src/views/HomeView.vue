<script setup>
import taiwanmap from '../components/icons/taiwanmap.vue'
import search from '../components/icons/CustomInput.vue'
</script>

<template>
      <div class="search">
        <search></search>
      </div>
    <div class="rightmap">
      <taiwanmap></taiwanmap>
    </div>
  <router-view></router-view>
</template>
<style>
body{
  width: 100vw;
  background-color: rgb(90, 122, 147);
}
/* #app {
  display: flex;
  max-width: 1280px;
  margin: 0;
  padding: 0;
  font-weight: normal;
} */
.search{
position: absolute;
top: 8%;
left: 10%;
width: 50%;
height: 15%;
display: flex;
}
.rightmap{
width: calc(100%-10%);
z-index: 88;
/* padding-right: 0.5rem;  */
}
svg{
width: 100%;
/* padding-right: 2rem; */
}
</style>
