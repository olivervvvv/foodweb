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
  background-color: rgb(66, 65, 65);
}
/* #app {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  font-weight: normal;
} */
.search{
position: absolute;
top: 3%;
left: 10%;
width: 42%;
height: 15%;
display: flex;
}
.rightmap{
width: calc(100%);
padding-right: 0.5rem;
}
svg{
width: 100%;
padding-right: 2rem;
}
</style>
