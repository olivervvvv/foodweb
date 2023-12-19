<script>
import search from "../components/icons/CustomInput.vue";
import { RouterLink, RouterView } from "vue-router";
export default {
  components: {
    RouterLink,
    RouterView,
    "custom-input": search,
  },
};
</script>
<template>
  <div class="body">
    <div class="header">
      <div class="search">
        <custom-input></custom-input>
      </div>
      <div class="rankLocationLink">
        <RouterLinl to="">月排名</RouterLinl>
        <RouterLinl to="">年排名</RouterLinl>
        <RouterLinl to="">市區排名</RouterLinl>
      </div>
      <div class="userPost"></div>
    </div>
    <router-view></router-view>
  </div>
</template>
<style>
.body {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(242, 227, 234);
}
.search {
  position: absolute;
  top: 30%;
  left: 16%;
  width: 250px;
  height: 40px;
}
.header {
  display: flex;
  
  position:relative;
  width: 100%;
  height: 100px;
  background-color: rgb(210, 206, 248);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 2;
}
.rankLocationLink{
  width: 10%;
  height: 80%;
}
</style>
