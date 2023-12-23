import { defineStore } from "pinia";
import axios from "axios";

export default defineStore("indexState", {
    state: () => ({
        piniaEmail: "",
        piniaPassword: "",
        piniaStoreName: "",
        piniaLocationCity: "",
        piniaStoreInfo: [],
        statusNum:0

    }),
    actions: {
        setEmail(email) {
            this.piniaEmail = email;
        },
        setPassword(pwd) {
            this.piniaPassword = pwd;
        },
        setStoreName(name) {
            this.piniaStoreName = name;
        },
        setLocationCity(locationCity) {
            this.piniaLocationCity = locationCity;
        },
        login() {
            axios.post("http://localhost:8081/users/login",
                {
                    "email": this.piniaEmail,
                    "password": this.piniaPassword
                },
                {
                    withCredentials: true,
                })
                .then(response => {
                    console.log(response.status);
                    // if (response.status == 200) {
                    //     console.log("xxx")
                    //     console.dir(this.$router)
                    //     console.log(this.$router)
                    //     this.$router.push('/storePage')
                    //     console.log("200")
                    //     return 200
                    // }
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status != 200) {
                        alert(error.response.data);
                    }
                });
        },
        async searchStoreNameAndLocation() {
            try {
                const response = await axios.get("http://localhost:8081/foodMap/searchNameAndLocal", {
                    params: {
                        "name": this.piniaStoreName,
                        "locationCity": this.piniaLocationCity
                    },
                });
                console.log(response);
                this.piniaStoreInfo = response.data.storeInfoList
                console.log(this.piniaStoreInfo)
                if (response.status === 200) {
                    console.log("200")
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    },
});
