<script>
import axios from "axios";
export default {
    data() {
        return {
            isFnListVisible: false,
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            storeName: "",
            locationCity: "",
            storeInfoList: {},
            userInfo: {},
            isLogIn: false,
            loginUserPicture:"",
            userName: "",
        }
    },
    mounted() {
        this.setInputValue();
        // 檢查是否已登入
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
        //點擊頭像顯示功能導覽列
        showFnList() {
            this.isFnListVisible = !this.isFnListVisible;
            // this.$router.push({ name: 'logi' });
        },
        //功能導覽列:至個人資料頁面
        goToUserInfoPage() {
            this.$router.push("/userInfo");
        },
        //功能導覽列:至個人貼文頁面
        goToUserPostPage() {
            this.$router.push("/userPost");
        },
        goToCreateStorePage() {
            this.$router.push("/AddStore");
        },
        goToPostPage(storeId) {
            this.$router.push({ name: 'postPage1', params: { storeId } });
        },
        //首次載入
        async setInputValue() {
            console.log("傳入之資料: ", this.$route.query.value);
            try {
                const response = await axios.get(`http://${locohost}/foodMap/searchString`, {
                    params: {
                        "inputString": this.$route.query.value,
                    },
                },{
                    withCredentials: true,
                });
                console.log(response);
                this.storeInfoList = response.data.storeInfoList
                console.log(this.storeInfoList)
                if (response.status === 200) {
                    console.log("200")
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        // 檢查是否已登入
        async logInCheck() {
            try {
                const response = await axios.get(`http://${locohost}/users/getcurrentUser`, {
                    withCredentials: true,
                });
                var loginState = response.data;
                console.log('loginState from DB:', loginState);
                //儲存登入狀態
                this.isLogIn=loginState.login;
                console.log("this.isLogIn : ",this.isLogIn);
                //儲存登入者名子
                this.userName = loginState.usersEntity.name;
                console.log("name",this.userName);
                //儲存登入者圖片
                this.loginUserPicture=loginState.usersEntity.picture;
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
        },
        //點擊城市按鈕顯示找到的相對應資料
        async searchCity(city) {
            console.log(city);
            this.locationCity = city;
            try {
                const response = await axios.get(`http://${locohost}/foodMap/searchNameAndLocal`, {
                    params: {
                        "name": "",
                        "locationCity": this.locationCity
                    },
                });
                console.log(response);
                this.storeInfoList = response.data.storeInfoList
                console.log(this.storeInfoList)
                if (response.status === 200) {
                    console.log("200")
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        //搜尋店家按鈕
        async searchStoreName() {
            try {
                const response = await axios.get(`http://${locohost}/foodMap/searchString`, {
                    params: {
                        "inputString": this.storeName,
                    },
                },{
                    withCredentials: true,
                });
                console.log(response);
                this.storeInfoList = response.data.storeInfoList
                console.log(this.storeInfoList)
                if (response.status === 200) {
                    console.log("200")
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    },
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
                    <input class="searchName" type="text" placeholder="搜尋地區或店名" v-model="this.storeName">
                    <button class="searchBtn" type="button" @click="searchStoreName()"><i
                            class="fa-solid fa-magnifying-glass"></i></button>
                </div>
                <!-- 會員中心 -->
                <div class="userCenterArea">
                    <div class="userPhoto">
                        <!-- 歡迎訊息 -->
                        <div style="width: 100px; height: auto; font-size:larger; color: white;"><span>您好! {{ userName }}</span></div>
                        <!-- 登入者圖片有效，顯示圖片；否則顯示默認圖片 -->
                        <img class="userBtn" :src="getImage(loginUserPicture)" alt="" @mouseenter="this.showFnList" v-if="getImage(loginUserPicture)&&this.isLogIn" >
                        <!-- 預設未登入頭貼 -->
                        <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="this.showFnList" v-else >
                        <!-- 登入者圖片下拉選單 -->
                        <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="showFnList">
                            <!-- 登入顯示 -->
                            <ul v-if="this.isLogIn">
                                <li @click="goToUserInfoPage">個人資料</li>
                                <li @click="goToUserPostPage">個人貼文</li>
                                <li @click="goToCreateStorePage">創建店家</li>
                                <li @click="logout()">登出</li>
                            </ul>
                            <!-- 未登入顯示 -->
                            <ul v-if="!this.isLogIn">
                                <li @click="login()">登陸</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 店家資訊區域 -->
        <div class="storeArea">
            <div class="storeCard" @click="goToPostPage(storeInfo.storeId)"
                v-for="(storeInfo, index) in this.storeInfoList">
                <div class="storePhoto">
                    <!-- BASE64店家圖片 -->
                    <img :src="getImage(storeInfo.picture)" v-if="storeInfo.picture">
                    <!-- 路徑店家圖片 -->
                    <img :src="`../../../${storeInfo.filePath}`" v-else-if="storeInfo.filePath">
                    <!-- 預設店家圖片 -->
                    <img src="../../main/resources/static/images/project_noPicture.png" alt="" v-else>
                </div>
                <div class="storeInfo">
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
                        <!-- 使用 v-if 檢查 storeInfo.userLike 是否存在 -->
                        <span v-if="storeInfo.userLike===0">{{ storeInfo.userLike }}</span>
                        <div v-if="storeInfo.userLike">
                            <span v-if="storeInfo.userLike!==0">{{ storeInfo.userLike.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 城市按鈕區域 -->
        <div class="RWD">
            <div class="cityArea">
                <div class="btnBorder">
                    <button v-for="cityString in city" class="cityBtn" @click="searchCity(cityString)">
                        {{ cityString }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@media screen and (max-width: 600px) {
    .bgArea .headerArea .fixed .searchArea[data-v-92ddc0ae] {
        width: 50%; /* 在螢幕寬度小於或等於 600px 時的寬度 */
    }
    .RWD{
        display: none;
    }
    .bgArea .headerArea .fixed .userCenterArea .userPhoto .userBtn[data-v-92ddc0ae] {
        margin-right: 0;
    }
    .bgArea .headerArea .fixed[data-v-92ddc0ae] {
        justify-content: space-evenly;
    }

}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.bgArea {
    width: 100vw;
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
            z-index: 99;

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
                        right: 20px;
                        transition: max-height 0.3s ease-in;
                        z-index: 2;
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


    .storeArea {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;

        .storeCard {
            width: 60%;
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
                max-height: 100%;
                padding: 10px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    object-fit: cover;
                    /* 圖片填滿整個區域，可能裁切部分內容 */
                }
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
                    font-size: 1.4em;
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
                    font-size: 1.1em;
                    color: #527853
                }
            }
        }
    }

    .cityArea {
        width: 160px;
        height: 440px;
        // width: 13%;
        // height: 70%;
        max-width: 100%;
        background-image: url("../sally/menu.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 3%;
        top: 20%;

        .btnBorder {
            // overflow-y: auto;
            width: 70%;
            max-height: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(55px, 1fr));
            justify-content: center;
            place-items: center;
            margin-top: 20px;

            .cityBtn {
                width: 55px;
                height: 35px;
                border: none;
                background: none;
                color: #EE7214;
                font-size: 1.2em;
                font-weight: bolder;
                cursor: pointer;

                &:hover {
                    color: #527853;
                }

                &:active {
                    color: #527853ac;
                }
            }
        }
    }
}
</style>