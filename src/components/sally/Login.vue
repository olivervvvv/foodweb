<script>
import { mapState, mapActions } from "pinia";
import indexState from "/src/stores/indexState.js";
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPasswordIcon: false,
      clearOnRotate: false,
      signupAccount: "",
      signupEmail: "",
      signupPassword: "",
      repeatPassword: "",
      loginCheckCord:"",
      signupCheckCord:"",
      isChecked: false,
      showSendBtn: true,
    };
  },
  computed: {
    ...mapState(indexState, ["piniaEmail", "piniaPassword", "statusNum"]),
  },
  methods: {
    setEmailAndPassword() {
      this.setEmail(this.email);
      this.setPassword(this.password);
    },
    ...mapActions(indexState, ["login", "setEmail", "setPassword"]),
    async login() {
      axios
        .post(
          `http://${locohost}/users/login`,
          {
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.status);
          if (response.status == 200) {
            console.log("xxx");
            this.$router.push("/20POST");
            console.log("200");
            return 200;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status != 200) {
            alert(error.response.data);
          }
        });
    },
    // 註冊
    async register() {
      const inputAccount = this.signupAccount;
      const inputEmail = this.signupEmail;
      const inputPassword = this.signupPassword;
      const inputRepeatPassword = this.repeatPassword;


      if (inputAccount === "" || inputPassword === "" || inputEmail === "") {
        alert("帳號、Email及密碼不得為空");
        return;
      } 
      else {
        if (inputPassword === inputRepeatPassword) {
          if (this.showSendBtn) {
            alert("請先取得驗證碼");
            return;
          }
          //=======================註冊邏輯=========================
          axios
            .get(
              `http://${locohost}/users/register?frontRandomCode=` + this.signupCheckCord,
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log(response);
              if (response.status == 201) {
                //   this.$router.push({ name: "loginAfter" });
                alert("註冊成功");
                this.isChecked = !this.isChecked;
              }
            })
            .catch((error) => {  // 使用箭頭函數以保持 this 的上下文
              console.log("error:");
              console.log(error);
              if (error.response.status == 400) {
                alert("驗證失敗,請重新取得驗證碼");
                this.showSendBtn = true;
              }
            });
          //=======================註冊邏輯=========================
        } else {
          alert("輸入密碼不相同");
        }
      }
    },
    //送出註冊驗證碼
    sendsignupCheckCord(){
      const inputAccount = this.signupAccount;
      const inputEmail = this.signupEmail;
      const inputPassword = this.signupPassword;
      const inputRepeatPassword = this.repeatPassword;
      if (inputAccount === "" || inputPassword === "" || inputEmail === "") {
        alert("帳號、Email及密碼不得為空");
      } else {
        if (inputPassword === inputRepeatPassword) {
      //=======================送出註冊驗證碼邏輯=========================
      axios
        .post(
          `http://${locohost}/sentRandomCodeToEmailForRegister`,
          {
            name: inputAccount,
            email: inputEmail,
            password: inputPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            alert("送出驗證碼成功");
            this.showSendBtn=false;
          }
        })
        .catch(function (error) {
          console.log("error:");
          console.log(error);
          if (error.response.status != 200) {
            alert(error.response.data);
          }
        });
        //=======================送出註冊驗證碼邏輯=========================
        } else {
            alert("輸入密碼不相同");
        }
      }
    },
    //送出登入驗證碼
    //sendloginCheckCord(){
    //},
    //選轉時清除輸入
    cleartxt() {
      this.email = "";
      this.password = "";
      this.signupAccount = "";
      this.signupPassword = "";
      this.signupEmail = "";
      this.repeatPassword = "";
    },
    //顯示輸入密碼
    showPassword() {
      this.showPasswordIcon = true;
      this.$refs.password.type = "text";
    },
    //隱藏輸入密碼
    hidePassword() {
      this.showPasswordIcon = false;
      this.$refs.password.type = "password";
    },
  },
  mounted() {},
};
</script>

<template>
  <!-- <h1>登入</h1>
    <span style="font-family: verdana, geneva, sans-serif">
        <div class="wrapper">
            <h1>Hello Again!</h1>
            <p>
                Welcome back you've <br />
                been missed!
            </p>
            <form>
                <input type="text" placeholder="Enter username" v-model="email" />
                <input type="password" placeholder="Password" v-model="password" />
                <p class="recover">
                    <a href="#">Recover Password</a>
                </p>
            </form>
            <button type="button" @click="this.setEmailAndPassword(), this.login()">Sign in</button>
            <p class="or">----- or continue with -----</p>
            <div class="not-member">Not a member? <a href="#">Register Now</a></div>
        </div>
    </span> -->

  <link
    rel="stylesheet"
    href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css"
  />
  <div class="coollogin">
    <div class="content">
      <div class="section pb-5 pt-5 pt-sm-2 text-center" >
        <!-- 頁面標籤 -->
        <h6 class="mb-0 pb-3">
          <span style="color: rgb(255, 255, 255);font-size: 25pt;user-select: none;cursor: pointer;" @click="this.isChecked=false">登陸 </span
          ><span style="color: rgb(255, 255, 255);font-size: 25pt;user-select: none;cursor: pointer;" @click="this.isChecked=true">註冊</span>
        </h6>
        <input
          class="checkbox"
          type="checkbox"
          id="reg-log"
          name="reg-log"
          @click="cleartxt"
          v-model="isChecked"
        />
        <label for="reg-log"></label>
        <div class="card-3d-wrap mx-auto">
          <div class="card-3d-wrapper">
            <!-- 登陸-->
            <div class="card-front">
              <div class="center-wrap">
                <div class="section text-center">
                  <h4 class="mb-4 pb-3" style="color: white">登陸</h4>
                  <div class="form-group">
                    <!-- 帳號輸入區 -->
                    <input
                      type="text"
                      name="logemail"
                      class="form-style"
                      placeholder="請輸入email"
                      id="email"
                      v-model="email"
                      autocomplete="off"
                    />
                    <i class="input-icon uil uil-at" style="color: white"></i>
                  </div>
                  <div class="form-group mt-2">
                    <!-- 密碼輸入區 -->
                    <input
                      type="password"
                      name="logpass"
                      class="form-style"
                      placeholder="請輸入密碼"
                      id="Password"
                      v-model="password"
                      autocomplete="off"
                      ref="password"
                    />
                    <i
                      v-if="showPasswordIcon"
                      class="input-icon uil uil-eye"
                      style="
                        cursor: pointer;
                        pointer-events: auto;
                        color: white;
                      "
                      @mousedown="showPassword"
                      @mouseup="hidePassword"
                      @mouseleave="hidePassword"
                    ></i>
                    <i
                      v-else
                      class="input-icon uil uil-eye-slash"
                      style="
                        cursor: pointer;
                        pointer-events: auto;
                        color: white;
                      "
                      @mousedown="showPassword"
                      @mouseup="hidePassword"
                      @mouseleave="hidePassword"
                    ></i>
                  </div>
                  <!-- 登入驗證碼 -->
                  <!-- <div class="form-group mt-2">
                    <input
                      type="text"
                      class="form-style"
                      placeholder="請輸入驗證碼"
                      id="loginCheckCord"
                      v-model="loginCheckCord"
                      autocomplete="off"
                    />
                    <i
                      style="color: white"
                      class="input-icon uil uil-envelope-question"
                    ></i>
                  </div> -->
                  <!-- 按鈕區-->
                  <div style="display: flex;justify-content: space-around;" >
                    <a
                      href="#"
                      class="btn mt-4"
                      @click="this.setEmailAndPassword(), this.login()"
                      style="color: rgb(0, 0, 0)"
                      >登陸</a
                    >
                    <!-- <a
                        href="#"
                        class="btn2 mt-4"
                        style="margin-top: 0; color: rgb(0, 0, 0)"
                        @click="sendloginCheckCord()"
                        >發送驗證碼</a> -->
                    </div>

                  <p class="mb-0 mt-4 text-center">
                    <a href="#" class="link" style="color: white">忘記密碼?</a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 註冊 -->
            <div class="card-back">
              <div class="center-wrap">
                <div class="section text-center">
                  <h4 style="color: white">註冊</h4>
                  <div class="form-group">
                    <input
                      type="text"
                      name="logname"
                      class="form-style"
                      placeholder="請輸入帳號"
                      id="singupAccount"
                      v-model="signupAccount"
                      autocomplete="off"
                    />
                    <i style="color: white" class="input-icon uil uil-user"></i>
                  </div>
                  <div class="form-group mt-2">
                    <input
                      type="text"
                      name="logname"
                      class="form-style"
                      placeholder="請輸入e-mail"
                      id="singupEmail"
                      v-model="signupEmail"
                      autocomplete="off"
                    />
                    <i style="color: white" class="input-icon uil uil-at"></i>
                  </div>
                  <div class="form-group mt-2">
                    <input
                      type="text"
                      name="logemail"
                      class="form-style"
                      placeholder="請輸入密碼"
                      id="singupPassword"
                      v-model="signupPassword"
                      autocomplete="off"
                    />
                    <i
                      style="color: white"
                      class="input-icon uil uil-lock-alt"
                    ></i>
                  </div>
                  <div class="form-group mt-2">
                    <input
                      type="text"
                      name="logpass"
                      class="form-style"
                      placeholder="請重複輸入密碼"
                      id="RepeatPassword"
                      v-model="repeatPassword"
                      autocomplete="off"
                    />
                    <i
                      style="color: white"
                      class="input-icon uil uil-lock-alt"
                    ></i>
                  </div>
                  <!-- 註冊驗證碼 -->
                  <div class="form-group mt-2">
                    <input
                      type="text"
                      class="form-style"
                      placeholder="請輸入驗證碼"
                      id="signupCheckCord"
                      v-model="signupCheckCord"
                      autocomplete="off"
                    />
                    <i
                      style="color: white"
                      class="input-icon uil uil-envelope-question"
                    ></i>
                  </div>

                  <div style="display: flex;justify-content: space-around;">
                    <a
                      href="#"
                      class="btn mt-4"
                      id="SignUpBtn"
                      style="margin-top: 0; color: rgb(0, 0, 0)"
                      @click="register()"
                      >註冊此帳號</a>
                    <a
                      v-if="this.showSendBtn"
                      href="#"
                      class="btn2 mt-4"
                      style="margin-top: 0; color: rgb(0, 0, 0)"
                      @click="sendsignupCheckCord()"
                      >發送驗證碼</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  height: 100vh;
  background-image: url(../sally/login-bg-small.png);
  background-size: cover; /* 或者使用 contain，根据需求选择 */
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.coollogin {
  width: 100vw;
}

@import url("https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800,900");

a {
  cursor: pointer;
  transition: all 200ms linear;
}

a:hover {
  text-decoration: none;
}

.link {
  color: #c4c3ca;
}

.link:hover {
  color: #ffeba7;
}

p {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
}

h4 {
  font-weight: 600;
}

h6 span {
  padding: 0 20px;
  text-transform: uppercase;
  font-weight: 700;
}

.section {
  position: relative;
  width: 100%;
  display: block;
}

.full-height {
  min-height: 100vh;
}

[type="checkbox"]:checked,
[type="checkbox"]:not(:checked) {
  position: absolute;
  left: -9999px;
}

.checkbox:checked + label,
.checkbox:not(:checked) + label {
  position: relative;
  display: block;
  text-align: center;
  width: 60px;
  height: 16px;
  border-radius: 8px;
  padding: 0;
  margin: 10px auto;
  cursor: pointer;
  background-color: #ffeba7;
}

.checkbox:checked + label:before,
.checkbox:not(:checked) + label:before {
  position: absolute;
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ffeba7;
  background-color: #279eff;
  font-family: "unicons";
  content: "\eb4f";
  z-index: 20;
  top: -10px;
  left: -10px;
  line-height: 36px;
  text-align: center;
  font-size: 24px;
  transition: all 0.5s ease;
}

.checkbox:checked + label:before {
  transform: translateX(44px) rotate(-270deg);
}

.card-3d-wrap {
  position: relative;
  width: 440px;
  max-width: 100%;
  height: 400px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  perspective: 800px;
  margin-top: 60px;
}

.card-3d-wrapper {//卡面大小
  width: 100%;
  height: 110%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transition: all 600ms ease-out;
}

.card-front,
.card-back {
  width: 100%;
  height: 100%;
  background-color: #2a2b38;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: 300%;
  position: absolute;
  border-radius: 6px;
  left: 0;
  top: 0;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.checkbox:checked ~ .card-3d-wrap .card-3d-wrapper {
  transform: rotateY(180deg);
}

.center-wrap {
  position: absolute;
  width: 100%;
  padding: 0 35px;
  top: 50%;
  left: 0;
  transform: translate3d(0, -50%, 35px) perspective(100px);
  z-index: 20;
  display: block;
}

.form-group {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
}

.form-style {
  padding: 13px 20px;
  padding-left: 55px;
  height: 48px;
  width: 100%;
  font-weight: 500;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.5px;
  outline: none;
  color: #c4c3ca;
  background-color: #1f2029;
  border: none;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
  box-shadow: 0 4px 8px 0 rgba(21, 21, 21, 0.2);
}

.form-style:focus,
.form-style:active {
  border: none;
  outline: none;
  box-shadow: 0 4px 8px 0 rgba(21, 21, 21, 0.2);
}

.input-icon {
  position: absolute;
  top: 0;
  left: 18px;
  height: 48px;
  font-size: 24px;
  line-height: 48px;
  text-align: left;
  color: #ffeba7;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:-ms-input-placeholder {
  color: #c4c3ca;
  opacity: 0.7;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input::-moz-placeholder {
  color: #c4c3ca;
  opacity: 0.7;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:-moz-placeholder {
  color: #c4c3ca;
  opacity: 0.7;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input::-webkit-input-placeholder {
  color: #c4c3ca;
  opacity: 0.7;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:focus:-ms-input-placeholder {
  opacity: 0;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:focus::-moz-placeholder {
  opacity: 0;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:focus:-moz-placeholder {
  opacity: 0;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.form-group input:focus::-webkit-input-placeholder {
  opacity: 0;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
}

.btn {
  border-radius: 4px;
  height: 44px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
  padding: 0 30px;
  letter-spacing: 1px;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  -ms-flex-pack: center;
  text-align: center;
  border: none;
  background-color: #ffeba7;
  color: #102770;
  box-shadow: 0 8px 24px 0 rgba(255, 235, 167, 0.2);
}

.btn:active,
.btn:focus {
  background-color: #279eff;
  color: #ffeba7;
  box-shadow: 0 8px 24px 0 rgba(16, 39, 112, 0.2);
}

.btn:hover {
  background-color: #279eff;
  color: #ffeba7;
  box-shadow: 0 8px 24px 0 rgba(16, 39, 112, 0.2);
}



.btn2{
  border-radius: 4px;
  height: 44px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  -webkit-transition: all 200ms linear;
  transition: all 200ms linear;
  padding: 0 30px;
  letter-spacing: 1px;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  -ms-flex-pack: center;
  text-align: center;
  border: none;
  background-color: #4CAF50;
  color: #ffeba7;
  box-shadow: 0 8px 24px 0 rgba(255, 235, 167, 0.2);
}

.btn2:active,
.btn2:focus {
  background-color: #3b8a3e;
  color: #ffeba7;
  box-shadow: 0 8px 24px 0 rgba(16, 39, 112, 0.2);
}

.btn2:hover {
  background-color: #3b8a3e;
  color: #ffeba7;
  box-shadow: 0 8px 24px 0 rgba(16, 39, 112, 0.2);
}
</style>
