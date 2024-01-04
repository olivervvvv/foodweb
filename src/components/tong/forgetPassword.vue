<template>
  <!-- <input type="checkbox" id="show"> -->
  <!-- <label for="show" class="show-btn">View Form</label> -->
  <div class="content">
    <!-- <div class="Logo"></div> -->
    <div class="logoArea">
      <button class="logoBtn" aria-label="回首頁" data-balloon-pos="down" @click="goToHomePage">
        <img src="../sally/logo-home.png" alt="">
      </button>
    </div>
    <div class="container">
      <!-- <label for="show" class="close-btn" title="close">×</label> -->
      <h1>忘記密碼</h1>
      <label v-if="showRandomCode">Email</label>
      <input type="text" placeholder="請輸入要找回密碼的Email" v-model="email" v-if="showRandomCode">
      <label v-if="!showRandomCode">驗證碼</label>
      <input type="text" placeholder="請輸入驗證碼" v-model="randomCode" v-if="!showRandomCode">
      <label v-if="!showRandomCode">重新設定新密碼</label>
      <input type="password" placeholder="請輸入要設定的新密碼" v-model="password" v-if="!showRandomCode">
      <label v-if="!showRandomCode">再次輸入密碼</label>
      <input type="password" placeholder="再次輸入密碼" v-model="repeatPassword" v-if="!showRandomCode">
      <button type="button" @click="sentRandomCode()" v-if="showRandomCode">發送驗證碼</button>
      <button type="button" @click="updatePassword()">輸入驗證碼驗證</button>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      email: "",
      randomCode: "",
      password: "",
      repeatPassword: "",
      showRandomCode: true
    }
  },
  methods: {
    //點擊logo回首頁
    goToHomePage() {
      this.$router.push("/");
    },
    sentRandomCode() {
      axios.post(`http://${locohost}/sentRandomCodeToEmailForForgetPassword`,
        {
          email: this.email
        },
        {
          withCredentials: true
        })
        .then(Response => {
          console.log(Response);
          this.showRandomCode = !this.showRandomCode;
          // alert("驗證碼發送成功，請去信箱查看您的驗證碼");
          Swal.fire({
              icon: "success",
              title: "驗證碼發送成功，請至信箱查看您的驗證碼",
              showConfirmButton: true,
          });
        })
        .catch(error => {
          if (error.response.status == 404) {
            // alert("此信箱並不存在");
            Swal.fire({
                icon: "error",
                title: "此信箱並不存在",
            });
          }
        })
    },
    updatePassword() {
      if (this.password != this.repeatPassword) {
        // alert("兩次密碼不一致");
        Swal.fire({
            icon: "error",
            title: "兩次密碼不一致",
        });
        return -1;
      }
      axios.post(`http://${locohost}/forgetPassword?randomCode=` + this.randomCode,
        {
          password: this.password
        },
        {
          withCredentials: true
        })
        .then(Response => {
          console.log(Response);
          this.showRandomCode = !this.showRandomCode;
          // alert("修改成功");
          Swal.fire({
              icon: "success",
              title: "修改成功",
              showConfirmButton: true,
          });
          this.$router.push({ name: "home" });
        })
        .catch(error => {
          console.log(error);
          this.showRandomCode = !this.showRandomCode;
          if (error.response.data == "驗證碼錯誤") {
            // alert("驗證碼錯誤, 請重新索取驗證碼");
            Swal.fire({
                icon: "error",
                title: "驗證碼錯誤, 請重新索取驗證碼",
            });
          }
        })
    }
  }

}
</script>

<style lang="scss" scoped >
/* .show-btn{
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
} */
.Logo {
  width: 200px;
  height: 120px;
  background-image: url(../sally/logo-home.png);
  background-size: cover;
  margin-bottom: 1%;
  margin-right: 0.2%;
}

.content {
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

input[type="checkbox"] {
  display: flex;
}

#show:checked~.container {
  display: block;
}

.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 450px;
  height: 400px;
  padding: 20px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* .container{
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%)
} */
/* .container .close-btn{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 25px;
    cursor: pointer;
} */
.close-btn:hover {
  color: red;
}

h1 {
  text-align: center;
  color: rgb(241, 2, 2);
  text-transform: uppercase;
}

form {
  margin: 20px;
}

label {
  display: block;
  color: rgb(222, 29, 29);
  font-size: 20px;
  margin-top: 10px;
}

input {
  display: block;
  width: 90%;
  background: transparent;
  border: none;
  outline: none;
  border-bottom: 1px solid rgb(243, 20, 20);
  padding: 10px;
  color: rgb(0, 0, 0);
}

button {
  display: block;
  width: 95%;
  padding: 8px;
  border: none;
  outline: none;
  margin-left: 2%;
  background: linear-gradient(to right, #e0c49d,
      #964706);
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
}

.logoArea {
  // width: 20%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.3%;
  margin-right: 0.2%;
  .logoBtn {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;

    img {
      height: 80px;
      margin-top: 10px;
    }
  }
}
</style>