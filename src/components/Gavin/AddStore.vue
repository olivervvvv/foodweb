<!-- 登入後顯示此畫面 -->
<script>
import { faListDots } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
export default {
    data() {
        return {
            isLogIn: false,
            isFnListVisible: false,
            inputValue: "",//搜尋欄輸入值
            loginUserPicture: "",
            city: ['基隆縣', '台北市', '新北市', '桃園市', '新竹', '苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '台南市', '高雄市', '屏東縣', '台東縣', '花蓮縣', '宜蘭縣', '金馬',],
            showCityList: false,
            locationCity: "",
            address: "",
            name: "",
            foodStyle: ""
        }
    },
    components: {
    },
    mounted() {
        this.logInCheck();
    },
    methods: {
        getImage(picture) {
            // 如果 picture 為 undefined，返回一個空字符串
            if (!picture) {
                return "";
            }
            // 直接返回 Base64 Data URL
            return "data:image/jpeg;base64," + picture;
        },
        //點擊logo回首頁
        goToHomePage() {
            this.$router.push("/");
        },
        //搜尋
        searchStoreName() {
            console.log("search inputtext : ", this.inputValue);
            // 使用 $router.push 實現頁面跳轉，並傳遞參數
            this.$router.push({
                name: "storePage",
                query: { value: this.inputValue }
            });
        },
        //點擊頭像顯示功能導覽列
        showFnList() {
            this.isFnListVisible = !this.isFnListVisible;
        },
        //功能導覽列:至個人資料頁面
        goToUserInfoPage() {
            this.$router.push("/userInfo");
        },
        //功能導覽列:至個人貼文頁面
        goToUserPostPage() {
            this.$router.push("/userPost");
        },
        // 檢查是否已登入，獲取會員資料
        async logInCheck() {
            try {
                const response = await axios.get(`http://${locohost}/users/getcurrentUser`, {
                    withCredentials: true,
                });
                var loginState = response.data;
                console.log('loginState from DB:', loginState);
                //儲存登入狀態
                this.isLogIn = loginState.login;
                console.log("this.isLogIn : ", this.isLogIn);
                //儲存登入者圖片
                this.loginUserPicture = loginState.usersEntity.picture;
                this.loginUserName = loginState.usersEntity.name;
                this.loginUserEmail = loginState.usersEntity.email;
                this.loginUserId = loginState.usersEntity.userId
                // console.log("loginUserPicture : ",this.loginUserPicture);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },
        //登入
        login() {
            console.log('login');
            this.$router.push("/login");
        },
        //登出
        async logout() {
            try {
                const response = await axios.get(`http://${locohost}/users/logout`, {
                    withCredentials: true,
                });
                const DBdata = response.data; // 這裡是後端返回的
                console.log('postData from DB:', DBdata);
                this.isLogIn = false;
                console.log("this.isLogIn : ", this.isLogIn)
            } catch (error) {
                console.error('Error fetching Post data:', error);
            }
            this.$router.push("/");
        },
        selectCity(cityName) {
            this.locationCity = cityName;
            this.showCityList = false;
        },
        async addStore() {
            // 检查必填字段
            if (!this.name || !this.address || !this.locationCity || !this.foodStyle) {
                // 使用 alert 显示提示框
                alert('請填寫所有資料');
                return;
            }
            const formData = {
                storeInfo: {
                    name: this.name,
                    address: this.address,
                    locationCity: this.locationCity,
                    foodStyle: this.foodStyle
                }
            }
            console.log('formData: ', formData);
            // console.log('this.name:', this.name);
            // console.log('this.address',this.address);
            // console.log('this.locationCity:', this.locationCity);
            try {
                const response = await axios.post(`http://${locohost}/foodMap/create`, formData, {
                    withCredentials: true,
                })
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                alert("成功創建店家:");
                    // 發布后可以隱藏創建貼文的頁面
                    this.showCreatePost = false;
                    // 刷新頁面
                    location.reload();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
}

</script>

<template>
    <div class="bgArea">
        <!-- Header區域 -->
        <div class="headerArea">
            <div class="fixed">
                <!-- logo -->
                <div class="logoArea">
                    <button class="logoBtn" aria-label="回首頁" data-balloon-pos="down" @click="goToHomePage">
                        <img src="../sally/logo 2.png" alt="">
                    </button>
                </div>
                <!-- 搜尋列 -->
                <div class="searchArea">
                    <input class="searchName" type="text" placeholder="搜尋地區或店名" v-model="this.inputValue">
                    <button class="searchBtn" type="button" @click="searchStoreName()"><i
                            class="fa-solid fa-magnifying-glass"></i></button>
                </div>
                <!-- 會員中心 -->
                <div class="userCenterArea">
                    <div class="userPhoto">
                        <div style="width: 100px; height: auto; font-size:larger; color: white;"><span>您好! {{ loginUserName }}</span></div>
                        <!-- 登入者圖片有效，顯示圖片；否則顯示默認圖片 -->
                        <img class="userBtn" :src="getImage(loginUserPicture)" alt="" @mouseenter="this.showFnList"
                            v-if="getImage(loginUserPicture) && this.isLogIn">
                        <!-- 預設未登入頭貼 -->
                        <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="this.showFnList" v-else>
                        <!-- 登入者圖片下拉選單 -->
                        <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="showFnList">
                            <!-- 登入顯示 -->
                            <ul v-if="this.isLogIn">
                                <li @click="goToUserInfoPage">個人資料</li>
                                <li @click="goToUserPostPage">個人貼文</li>
                                <li style="color: #527853; cursor: default;" @click="goToCreateStorePage">創建店家</li>
                                <li @click="logout()">登出</li>
                            </ul>
                            <!-- 未登入顯示 -->
                            <ul v-if="!this.isLogIn">
                                <li @click="login()">登入</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 創建店家區域 -->
        <div class="addStoreArea">
            <div class="inputContainer">
                <label for="storeName">店家名稱：</label>
                <input type="text" name="" id="storeName" v-model="name">
                <label for="storeAddress">店家地址：</label>
                <input type="text" name="" id="storeAddress" v-model="address">
                <label for="foodStyle">店家類型：</label>
                <input type="text" name="" id="foodStyle" v-model="foodStyle">
                <div class="inputItem">
                    <label for="locaCity">所在城市：</label>
                    <div class="cityArea">
                        <input class="inputCity" type="text" name="" id="locaCity" v-model="locationCity" disabled>
                        <button class="cityBtn" @click="showCityList = true">選擇所在城市</button>
                    </div>
                </div>
            </div>
            <div class="addStoreBtnArea">
                <button class="addStoreBtn" @click="addStore()">創建店家</button>
            </div>
        </div>

        <!-- 顯示城市按鈕 -->
        <div v-if="showCityList" class="blur-background">
            <div class="cityBtnArea">
                <div class="closeArea">
                    <button class="closeBtn" @click="showCityList = false"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="btn-container">
                    <button class="cityBtn" v-for="(cityName, index) in city" :key="index" @click="selectCity(cityName)">{{
                        cityName }}</button>
                    <!-- <button class="cityBtn cancel" @click="showCityList = false">取消</button> -->
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.bgArea {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .headerArea {
        width: 100vw;
        height: 80px;

        .fixed {
            width: 100vw;
            height: 80px;
            background-color: #EE7214;
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2;

            .logoArea {
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

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

            .searchArea {
                width: 60vw;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .searchName {
                    width: 90%;
                    height: 55%;
                    background-color: white;
                    border: none;
                    outline: none;
                    border-top-left-radius: 100px;
                    border-bottom-left-radius: 100px;
                    font-size: 1.2em;
                    text-indent: 20px;
                }

                .searchBtn {
                    width: 10%;
                    height: 55%;
                    background-color: white;
                    border: none;
                    outline: none;
                    border-top-right-radius: 100px;
                    border-bottom-right-radius: 100px;
                    color: #EE7214;
                    font-size: 1.5em;
                    font-weight: bolder;
                    cursor: pointer;

                    &:hover {
                        color: #ee7214b2;
                        text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
                    }
                }
            }

            .userCenterArea {
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .userPhoto {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: end;
                    align-items: center;
                    margin-right: 20px;

                    .userBtn {
                        border: none;
                        border-radius: 50%;
                        width: 55px;
                        height: 55px;
                        padding: 0;
                        // position: absolute;
                        // right: 70px;
                        // right: 0px;
                        margin-right: 50px;
                        cursor: pointer;
                    }

                    .userFnList {
                        /* display: none; */
                        overflow: hidden;
                        max-height: 0;
                        position: fixed;
                        top: 90px;
                        right: 35px;
                        transition: max-height 0.3s ease-in;
                        z-index: 1;
                        background-color: white;
                        width: 120px;
                        border-radius: 10px;
                        font-size: 1.2em;
                        font-weight: bolder;
                        color: #EE7214;
                        display: flex;
                        justify-content: center;

                        &.fnListVisible {
                            max-height: 125px;
                            transition: max-height .3s ease-in;
                            display: flex;
                            justify-content: center;
                        }

                        li {
                            list-style-type: none;
                            margin: 2px 0;
                            cursor: pointer;

                            &:hover {
                                color: #527853;
                            }
                        }
                    }
                }
            }
        }
    }

    .addStoreArea {
        width: 100vw;
        height: calc(100vh - 80px);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 100px;

        .inputContainer {
            width: 50%;
            display: block;
            flex-direction: column;
            justify-content: center;

            label {
                font-size: 1.2em;
                font-weight: bolder;
                color: #EE7214;
            }

            input {
                width: 100%;
                outline-style: none;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 5px;
                font-size: 1.2em;
                font-weight: 700;
                margin-bottom: 20px;
                text-indent: 10px;

                &::placeholder {
                    color: #ccc;
                }

                &:hover {
                    border-color: #EE7214;
                    outline: 0;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                        0 0 8px #ee7214b2;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #ee7214b2;
                }
            }

            .inputItem {
                display: flex;
                flex-direction: column;

                .cityArea {
                    display: flex;
                    justify-content: space-between;

                    .inputCity {
                        width: calc(100% - 160px);
                    }

                    .cityBtn {
                        background-color: #EE7214;
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1.2em;
                        width: 140px;
                        height: 31px;
                        padding: 0 10px;
                        font-weight: bolder;

                        &:hover {
                            background-color: #ee7214b2;
                        }
                    }
                }
            }
        }

        .addStoreBtnArea {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            .addStoreBtn {
                width: 100px;
                padding: 10px;
                margin: 5px;
                background-color: #EE7214;
                color: white;
                font-size: 1.2em;
                font-weight: bolder;
                border: none;
                border-radius: 10px;
                cursor: pointer;

                &:hover {
                    background-color: #ee7214b2;
                }
            }
        }
    }

    .blur-background {
        backdrop-filter: blur(5px);
        /* 調整像素值以增加或減少模糊效果 */
        background-color: rgba(255, 255, 255, 0.5);
        /* 調整顏色和透明度 */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        /* 確保在其他元素之上 */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .cityBtnArea {
            width: 400px;
            // height: 60%;
            padding: 10px;
            z-index: 99;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .closeArea {
            display: flex;
            justify-content: end;
            align-items: center;

            .closeBtn {
                background-color: rgb(0, 0, 0, 0);
                border: none;
                font-size: 25pt;
                color: #EE7214;
                margin-right: 10px;

                &:hover {
                    color: #ee7214b2;
                    text-shadow: 1px 1px lightgray;
                }
            }
        }

        .btn-container {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            .cityBtn {
                width: 100px;
                padding: 10px;
                margin: 8px;
                background-color: #EE7214;
                color: white;
                font-size: 1.2em;
                font-weight: bolder;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

                &:hover {
                    background-color: #ee7214b2;
                }
            }

            // .cancel {
            //     background-color: #c0c0c0;

            //     &:hover {
            //         background-color: #c0c0c0a7;
            //     }
            // }
        }
    }
}
</style>
