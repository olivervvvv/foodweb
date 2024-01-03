<template>
  
  <input type="checkbox" id="show">
  <label for="show" class="show-btn">View Form</label>

  <div class="container">
    <label for="show" class="close-btn" title="close">×</label>
    <h1>Welcome</h1>
        <label v-if = "showRandomCode">Email</label>
        <input type="text" placeholder="Email" v-model="email" v-if = "showRandomCode">
        <label v-if = "!showRandomCode">randomCode</label>
        <input type="text" placeholder="randomCode" v-model="randomCode" v-if = "!showRandomCode">
        <label v-if = "!showRandomCode">Password</label>
        <input type="password" placeholder="Password" v-model="password" v-if = "!showRandomCode">
        <label v-if = "!showRandomCode">Repeat Password</label>
        <input type="password" placeholder="RepeatPassword" v-model="repeatPassword" v-if = "!showRandomCode">
        <button type="button" @click="updatePassword()">驗證</button>
        <button type="button" @click="sentRandomCode()" v-if = "showRandomCode">發送驗證碼</button>
        
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data(){
    return{
      email:"",
      randomCode:"",
      password:"",
      repeatPassword:"",
      showRandomCode:true
    }
  },
  methods:{
    sentRandomCode(){
      axios.post(`http://${locohost}/sentRandomCodeToEmailForForgetPassword`,
      {
        email:this.email
      },
      {
        withCredentials:true
      })
      .then( Response => {
        console.log(Response);
        this.showRandomCode = !this.showRandomCode;
        alert("驗證碼發送成功，請去信箱查看您的驗證碼");
      })
      .catch( error =>{
        if(error.response.status == 404){
          alert("此信箱並不存在");
        }
      })
    },
    updatePassword(){
      if(this.password != this.repeatPassword){
        alert("兩次密碼不一致");
        return -1;
      }
      axios.post(`http://${locohost}/forgetPassword?randomCode=` + this.randomCode,
      {
        password:this.password
      },
      {
        withCredentials:true
      })
      .then( Response => {
        console.log(Response);
        this.showRandomCode = !this.showRandomCode;
        alert("修改成功");
        this.$router.push({name:"home"});
      })
      .catch( error =>{
        console.log(error);
        this.showRandomCode = !this.showRandomCode;
        if(error.response.data == "驗證碼錯誤"){
          alert("驗證碼錯誤, 請重新索取驗證碼");
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped >

.show-btn{
    padding: 10px 20px;
    font-size: 20px;
    font-weight: 500;
    color: rgb(215, 34, 34);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.25);
}
.show-btn{
    position: absolute;
    top: 45%;
    left: 30%;
    transform: translate(-50%, -50%);
}
input[type="checkbox"]{
    display: none;
}
#show:checked ~ .container{
    display: block;
}
.container{
    display: none;
    width: 350px;
    padding: 20px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.18);
}
.container{
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%)
}
.container .close-btn{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 25px;
    cursor: pointer;
}
.close-btn:hover{
    color: red;
}
h1{
    text-align: center;
    color: rgb(241, 2, 2);
    text-transform: uppercase;
}
form{
    margin: 20px;
}
label{
    display: block;
    color: rgb(222, 29, 29);
    font-size: 18px;
    margin-top: 10px;
}
input{
    display: block;
    width: 90%;
    background: transparent;
    border: none;
    outline: none;
    border-bottom: 1px solid rgb(243, 20, 20);
    padding: 10px;
    color: rgb(0, 0, 0);
}
button{
    display: block;
    width: 95%;
    padding: 8px;
    border: none;
    outline: none;
    background: linear-gradient(to right, #cbb4d4, 
    #20002c);
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-top: 20px;
}

</style>