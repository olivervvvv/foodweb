<template>
  <button type="button" class="searchBtn" @click="goToStorePage()">回店家搜尋頁</button>
  <button type="button" class="searchBtn" @click="goToMap()">回地圖</button>
  <button type="button" class="searchBtn" @click="goToLogin()">登陸</button>
  <button type="button" class="searchBtn" @click="goToUserInfo()">個人資料</button>
</template>

<script>
export default {
  methods:{
    goToMap(){
      this.$router.push({name:"home"});

    },
    goToLogin(){
      this.$router.push({name:"login"});
    },
    goToStorePage(){
      this.$router.push({name:"storePage"});
    },
    goToUserInfo(){
      this.$router.push({name:"userInfo"});
    }


  }

}
</script>

<style lang="scss"  scoped>
.searchBtn {
            // width: 120px;
            height: 30px;
            margin: 15px;
            background-color: #EE7214;
            border: none;
            border-radius: 5px;
            color: white;
            font-weight: bolder;
            cursor: pointer;
            transition: transform 1s;
            &:hover{
              font-size: 36px;
              color: rgb(223, 0, 67);
              transition: 1s;
            }
}

</style>