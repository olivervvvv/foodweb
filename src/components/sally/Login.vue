<script>
import { mapState, mapActions } from "pinia";
import indexState from "/src/stores/indexState.js";
import axios from "axios";

export default {
    data() {
        return {
            email: "",
            password: ""
        };
    },
    computed:{
        ...mapState(indexState, ["piniaEmail", "piniaPassword","statusNum"]),
    },
    methods: {
        setEmailAndPassword(){
            this.setEmail(this.email);
            this.setPassword(this.password);
            // this.login()
            // let loginStatus = this.login()
            // console.log(loginStatus)
            // if(loginStatus == 200){
            //     console.log(loginStatus)
            //     this.$router.push('/storePage')
            // }
        },
        ...mapActions(indexState, ["login", "setEmail", "setPassword"]),
        login() {
            axios.post("http://localhost:8081/users/login",
                {
                    "email": this.email,
                    "password": this.password
                },
                {
                    withCredentials: true,
                })
                .then(response => {
                    console.log(response.status);
                    if (response.status == 200) {
                        console.log("xxx")
                        this.$router.push('/storePage')
                        console.log("200")
                        return 200
                    }
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status != 200) {
                        alert(error.response.data);
                    }
                });
        }

    },
    mounted(){
        
    },
};
</script>


<template>
    <h1>登入</h1>
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
    </span>
</template>

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