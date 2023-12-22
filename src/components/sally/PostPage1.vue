<script>
import Header from "../sally/Header.vue";
import { mapState } from "pinia";
import indexState from '../../stores/indexState';
import axios from 'axios';

export default {
    data() {
        return {
            postInfoList:[]
        }
    },
    components: {
        Header
    },
    mounted() {
        this.getStoreInfo()
    },
    methods: {
        getStoreInfo() {
            this.storeId = this.$route.params.storeId;
            axios.get(`http://localhost:8081/posts/getPostList?storeId=${this.storeId}`)
                .then(response => {
                    console.log(response);
                    this.postInfoList = response.data.postInfoList
                })
                .catch(error => {
                    console.log(error);
                });
        },

    },
    computed: {
        ...mapState(indexState, ["piniaStoreInfo"])
    }
}
</script>

<template>
    <div class="body">
        <div class="header">
            <Header></Header>
        </div>
        <div class="storeCard">
            <div class="storePhoto">
                <img src="" alt="">
            </div>
            <div class="storeInfo">
                <span class="storeTitle">太初麵食りょうり</span>
                <div class="storeStyle">
                    <i class="fa-solid fa-utensils"></i>
                    <span>台式料理</span>
                </div>
                <div class="storeAddress">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>408台中市南屯區公益路二段115號</span>
                </div>
                <div class="score">
                    <i class="fa-regular fa-star"></i>
                    <span>1.25</span>
                </div>
            </div>
        </div>
        <div class="postArea">
            <span class="line">關於<span>{{ "太初麵食りょうり" }}</span>的貼文</span>
            <div class="post" v-for="(post, index) in postInfoList">
                <p class="postTitle">{{ post.postTitle}}</p>
                <button class="moreBtn">More...</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
body{
    background-color: pink;
}
.body {
    width: 95vw; //目前不能滿版！
    height: 100vh;
    // padding: 10% 5% 0;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background: #F9E8D9;

    .storeCard {
        width: 60%;
        height: 150px;
        background-color: white;
        border-radius: 10px;
        // border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        margin: 5px 0;
        display: flex;

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

    .postArea {
        width: 60%;
        background: white;
        border-radius: 10px;
        // border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        margin-top: 10px;
        padding: 15px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
            // display: block;
            margin: 15px 0;
            font-size: 20px;
            font-weight: bolder;
            color: #527853;
            position: relative;
        }

        .line:before,
        .line:after {
            content: "";
            position: absolute;
            top: 55%;
            background: #527853;
            width: 100px;
            height: 2px;
        }

        .line:before {
            left: -50%;
        }

        .line:after {
            right: -50%;
        }

        .post {
            width: 95%;
            height: 40px;
            border-radius: 5px;
            // border: 1px solid rgba(222, 142, 99, 0.631);
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
            padding: 0 10px;

            .postTitle {
                font-weight: bolder;
            }

            .moreBtn {
                width: 60px;
                height: 25px;
                background-color: #F7B787;
                border: none;
                border-radius: 5px;
                color: white;
                font-weight: bolder;
                cursor: pointer;
            }
        }
    }


}</style>