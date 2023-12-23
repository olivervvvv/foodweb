<script>
import Header from "../sally/Header.vue";
import { mapState } from "pinia";
import indexState from '../../stores/indexState'
export default {
    data() {
        return {
            
        }
    },
    components: {
        Header
    },
    methods: {
        goToPostPage(storeId) {
            this.$router.push({ name: 'postPage1', params: { storeId } });
        },

    },
    computed:{
        ...mapState(indexState, ["piniaStoreInfo"])
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
                    <img :src="storeInfo.filePath" alt="">
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
    </div>
</template>
<style lang="scss">
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
    // padding: 10% 5% 0;
    display: flex;
    flex-direction: column;

    .storeArea {
        width: 60%;
        height: 80vh;
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
            height: inherit;
            // border: 1px solid black;
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