<script>
import { mapState, mapActions } from 'pinia'
import indexState from '../../stores/indexState'
import axios from "axios";
export default {
    data() {
        return {
            // locationArr: [
            //     {
            //         "name": "台北市"
            //     },
            //     {
            //         "name": "基隆市"
            //     },
            //     {
            //         "name": "新北市"
            //     },
            //     {
            //         "name": "宜蘭縣"
            //     },
            //     {
            //         "name": "連江縣"
            //     },
            //     {
            //         "name": "新竹市"
            //     },
            //     {
            //         "name": "新竹縣"
            //     },
            //     {
            //         "name": "桃園市"
            //     },
            //     {
            //         "name": "苗栗縣"
            //     },
            //     {
            //         "name": "台中市"
            //     },
            //     {
            //         "name": "彰化縣"
            //     },
            //     {
            //         "name": "南投縣"
            //     },
            //     {
            //         "name": "嘉義市"
            //     },
            //     {
            //         "name": "嘉義縣"
            //     },
            //     {
            //         "name": "雲林縣"
            //     },
            //     {
            //         "name": "台南市"
            //     },
            //     {
            //         "name": "高雄市"
            //     },
            //     {
            //         "name": "屏東縣"
            //     },
            //     {
            //         "name": "台東縣"
            //     },
            //     {
            //         "name": "花蓮縣"
            //     },
            //     {
            //         "name": "澎湖縣"
            //     },
            //     {
            //         "name": "金門縣"
            //     }
            // ],
            storeName: "",
            locationCity: "",
            piniaStoreInfo: [],
        }
    },
    computed: {

        // storeInfo() {
        //     return this.piniaStoreInfo; // 将 storeInfo 暴露给父组件
        // },
    },
    methods: {

        // async getStoreNameAndLocationCity() {
        //     this.setStoreName(this.storeName)
        //     this.setLocationCity(this.locationCity)
        //     // try {
        //     //     let storeInfo = await this.searchStoreNameAndLocation()
        //     //     console.log(storeInfo)
        //     // } catch (error) {
        //     //     console.error(error)
        //     // }
        //     this.searchStoreNameAndLocation()
        // },
        async getStoreNameAndLocationCity() {
            try {
                const response = await axios.get(`http://${locohost}/foodMap/searchNameAndLocal`, {
                    params: {
                        "name": this.storeName,
                        "locationCity":""
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
    mounted() {
    },
}
</script>
<template>
    <div class="bgArea">
        <div class="logo">
            <img src="../sally/logo 2.png" style="width: 100px;" alt="">
        </div>
        <div class="searchArea">
            <input class="searchName" type="text" placeholder="搜尋店名" v-model="this.storeName">
            <!-- <select class="searchLocation" name="" id="location" @change="this.getLocation()">
                <option value="">地區</option>
                <option v-for="item in this.locationArr" :value="item.name">{{ item.name }}</option>
            </select> -->
            <button class="searchBtn" type="button" @click="getStoreNameAndLocationCity()">search</button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}
body{
    background: #F9E8D9;
}
.bgArea {
    width: 100vw;
    height: 20vh;
    background-color: #EE7214;
    display: flex;
    align-items: center;

    .searchArea {
        width: 50vw;
        height: 40px;
        background-color: white;
        border-radius: 40px;
        display: flex;
        padding: 5px 0 5px 10px;

        .searchName {
            width: 85%;
            height: 30px;
            border: none;
            outline: none;
            background-color: white;
            border-top-left-radius: 100px;
            border-bottom-left-radius: 100px;
            font-size: larger;
            text-indent: 20px;
        }

        // .searchLocation {
        //     border: none;
        //     outline: none;
        //     font-size: larger;
        //     option:checked {
        //         background-color: #F7B787;
        //         color: #333;
        //     }
        // }

        .searchBtn {
            width: 60px;
            height: 30px;
            background-color: #EE7214;
            border: none;
            border-radius: 5px;
            color: white;
            font-weight: bolder;
            cursor: pointer;
        }
    }
}
</style>