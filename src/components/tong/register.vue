<template>
  <span style="font-family: verdana, geneva, sans-serif">
    <div class="wrapper">
      <h1>Register</h1>
      <br />
      <form>
        <h3 style="margin-right: 200px">用戶名:</h3>
        <input type="text" placeholder="Enter username" v-model="name" />
        <h3 style="margin-right: 220px">信箱:</h3>
        <input type="text" placeholder="Enter email" v-model="email" />
        <h3 style="margin-right: 220px">密碼:</h3>
        <input
          type="password"
          placeholder="Enter Password"
          v-model="password"
        />
        <h3 style="margin-right: 190px">確認密碼:</h3>
        <input
          type="password"
          placeholder="Repeat Password"
          v-model="repeatPassword"
        />
      </form>
      <button type="button" @click="register()">Register</button>
    </div>
  </span>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      repeatPassword:""
    };
  },
  methods: {
    register() {
      
    if(this.password != this.repeatPassword){
        alert("兩次密碼不相同");
        return -1;
    }
    
    
      axios
        .post(
          "http://localhost:8081/users/register",
          {
            name: this.name,
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            //   this.$router.push({ name: "loginAfter" });
            alert("註冊成功");
          }
        })
        .catch(function (error) {
          console.log("error:");
          console.log(error);
          if (error.response.status != 200) {
            alert(error.response.data);
          }
        });
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body {
  background: #dfe9f5;
}
.wrapper {
  width: 330px;
  padding: 2rem 0 1rem 0;
  margin: 50px auto;
  background: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
}
h1 {
  font-size: 2rem;
  color: #07001f;
}
h3 {
  color: #07001f;
}
p {
  margin-bottom: 1.7rem;
}
form input {
  width: 85%;
  outline: none;
  border: none;
  background: #dfe9f5;
  padding: 12px 14px;
  margin-bottom: 10px;
  border-radius: 10px;
}
.recover {
  text-align: right;
  font-size: 0.8rem;
  margin: 0.2rem 1.7rem 0 0;
}
.recover a {
  text-decoration: none;
  color: #07001f;
}
button {
  font-size: 1.1rem;
  margin-top: 1rem;
  padding: 8px 0;
  border-radius: 5px;
  outline: none;
  border: none;
  width: 85%;
  background: tomato;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background: rgba(122, 30, 30, 0.767);
}
.or {
  font-size: 0.8rem;
  margin-top: 1.5rem;
}
.icons i {
  color: #07001f;
  padding: 00.8rem 1.5rem;
  border-radius: 10px;
  margin-left: 0.9rem;
  font-size: 1.5rem;
  cursor: pointer;
  border: 2px solid #dfe9f5;
}
.icons i:hover {
  color: #fff !important;
  background: #07001f;
  transition: 1s;
}
.icons i:first-child {
  color: green;
}
.icons i:last-child {
  color: blue;
}
.not-member {
  font-size: 0.8rem;
  margin-top: 1.4rem;
}
.not-member a {
  color: tomato;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
