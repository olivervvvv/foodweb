<script setup>
import taiwanmap from '../components/icons/taiwanmap.vue'
import search from '../components/icons/CustomInput.vue'
</script>

<template>
  <div class="Logo"></div>
      <div class="search">
        <search></search>
      </div>
    <div class="rightmap">
      <taiwanmap></taiwanmap>
    </div>
  <router-view></router-view>
</template>
<style >
body{

  background-color: #F9E8D9;
}
.Logo{
  position: fixed;
  width: 50px;
  height: 150px;
  background-size: contain; 
  top: 2%;
  left: 3%;
  background-image: url("../../public/exploreMan.png");
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
/* top: 8%; */
left: 10%;
width: 50%;
height: 15%;
display: flex;
top: 6%;
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
