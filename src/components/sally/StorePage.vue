<script>
import Header from "../sally/Header.vue";
import rightCityBtn from "../yifeng/test.vue";
import { mapState } from "pinia";
import indexState from '../../stores/indexState'
import axios from "axios";
export default {
    data() {
        return {
            piniaStoreInfo:{},
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            locationCity:"",
        }
    },
    mounted() {
        this.setInputValue();
    },
    components: {
        Header,
        rightCityBtn,
    },
    methods: {
        goToPostPage(storeId) {
            this.$router.push({ name: 'postPage1', params: { storeId } });
        },
        //首次載入
        async setInputValue(){
            console.log("傳入之資料: ",this.$route.query.value);
            try {
                const response = await axios.get("http://localhost:8081/foodMap/searchNameAndLocal", {
                    params: {
                        "name": this.$route.query.value,
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
        //按地區按鈕顯示找到的相對應資料
        async clickArea(city) {
            console.log(city);
            this.locationCity=city;
            try {
                const response = await axios.get("http://localhost:8081/foodMap/searchNameAndLocal", {
                    params: {
                        "name": "",
                        "locationCity": this.locationCity
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
    computed:{
        // ...mapState(indexState, ["piniaStoreInfo"])
    }
}
</script>
<template>
    <div class="bgArea">
        
        <div class="header">
            <Header></Header>
        </div>
        <div class="storeArea">
            <div class="storeCard" @click="goToPostPage(storeInfo.storeId)" v-for="(storeInfo, index) in this.piniaStoreInfo">
                <div class="storePhoto">
                    <img :src="storeInfo.filePath" alt="" >
                </div>
                <div class="storeInfo" >
                    <span class="storeTitle">{{ storeInfo.name }}</span>
                    <div class="storeStyle">
                        <i class="fa-solid fa-utensils"></i>
                        <span>{{ storeInfo.foodStyle }}</span>
                    </div>
                    <div class="storeAddress">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>{{ storeInfo.address }}</span>
                    </div>
                    <div class="score">
                        <i class="fa-regular fa-star"></i>
                        <span>{{ storeInfo.userLike }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 城市按鈕區域 -->
        <div class="rightArea">
            <div class="area" v-for="cityString in city">
                <button v-for="cityString in city" class="btn1" @click="clickArea(cityString)">
                    {{ cityString }}
                </button>
            </div>
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
// body{
//     background: #F9E8D9;
// }

.rightArea {
    height: 50%;
    width: 16%;
    border: 3px solid rgb(245, 177, 59);
    display: flex;
    position: fixed;
    right: 1%;
    top: 25%;
    border-radius: 30px;
    .area {
        position: fixed;
        right: 1%;
        height: 50%;
        width: 16%;
        border: 0px solid;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .btn1 {
            margin: 5px;
            width: 70px;
            height: 35px;
            font-size: 15pt;
            border: 0px;
            background-color: gainsboro;
            border-radius: 30px;

            &:hover {
                background-color: rgb(122, 134, 125);
                
            }
            &:active{
                background-color: rgb(249, 216, 105);
            }
        }
    }
}
.bgArea {
    // padding: 10% 5% 0;
    display: flex;
    flex-direction: column;

    .storeArea {
        width: 60%;
        height: 80vh;
        margin: 20px;
        margin-left: 8%;
    }

    .storeCard {
        width: 100%;
        height: 150px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        margin: 5px 0;
        display: flex;
        transition: 0.5s;
        cursor: pointer;

        &:hover {
            scale: 0.98;
        }

        .storePhoto {
            width: 40%;
            max-height: 100%; /* 最大高度為父元素的100% */
            // width: 40%;
            // height: inherit;
        }
        .storePhoto img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* 圖片填滿整個區域，可能裁切部分內容 */
        }

        .storeInfo {
            width: 60%;
            height: inherit;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;

            .storeTitle {
                font-weight: bolder;
                font-size: x-large;
                color: #EE7214;
            }

            .storeTitle,
            .storeStyle,
            .storeAddress {
                margin: 3px;
                display: flex;
                align-items: center;
            }

            .score {
                width: 70px;
                height: 25px;
                border-radius: 50px;
                background-color: #EE7214;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 3px;

                span,
                i {
                    color: white;
                }
            }

            span,
            i {
                margin: 0 3px;
                font-weight: bolder;
                font-size: medium;
                color: #527853
            }
        }
    }

}
</style>