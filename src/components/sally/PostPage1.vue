<script>
import { mapState } from "pinia";
import indexState from "../../stores/indexState";
import axios from "axios";
export default {
    data() {
        return {
            isFnListVisible: false,//header需要
            storeId: 0,
            postInfoList: {},
            storeInfoList: {},

            storeInfo:{},
            goToPostpostId:0,


            storeInfo: {},
            goToPostpostId: 0,

            showCreatePost: false, // 控制是否显示创建贴文的页面
            description: "", // 存储新贴文的内容
            postTitle: "",
            picture: null,
            inputValue:"",//搜尋欄輸入值
            isLogIn:false,//登入狀態
        };
    },
    components: {
    },
    mounted() {
        this.getPostInfo();
        this.getStoreInfo();
        // 檢查是否已登入
        this.logInCheck();
    },
    methods: {
        //點擊logo回首頁
        goToHomePage() {
            this.$router.push("/");
        },
        //搜尋
        searchStoreName(){
            console.log("search inputtext : ",this.inputValue);
            // 使用 $router.push 实现页面跳转，并传递参数
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
        goToPostPage(storeId) {
            this.$router.push({ name: 'postPage1', params: { storeId } });
        },
                // 檢查是否已登入
                async logInCheck(){
            try {
                const response = await axios.get(`http://${locohost}/users/getcurrentUser`,{
                    withCredentials: true,
                });
                var loginState = response.data;
                console.log('loginState from DB:', loginState);
                this.isLogIn=loginState.login;
                console.log("this.isLogIn : ",this.isLogIn)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },
        // 檢查是否已登入
        async logInCheck(){
            try {
                const response = await axios.get(`http://${locohost}/users/getcurrentUser`,{
                    withCredentials: true,
                });
                var loginState = response.data;
                console.log('loginState from DB:', loginState);
                this.isLogIn=loginState.login;
                console.log("this.isLogIn : ",this.isLogIn)
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
        async logout(){
            try {
            const response = await axios.get(`http://${locohost}/users/logout`,{
                withCredentials: true,
            });
            const DBdata = response.data; // 這裡是後端返回的
            console.log('postData from DB:', DBdata);
            this.isLogIn=false;
            console.log("this.isLogIn : ",this.isLogIn)
            } catch (error) {
                console.error('Error fetching Post data:', error);
            }
        },
        async getStoreInfo() {
            this.storeId = this.$route.params.storeId;
            console.log("this.storeId : ", this.storeId);
            try {
                const response = await axios.get(`http://${locohost}/foodMap/searchStoreId?storeId=${this.storeId}`);
                const storeData = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('storeData from DB:', storeData);
                this.storeInfo = storeData.storeInfo;
                console.log('this.storeInfoList :', this.storeInfo);
            } catch (error) {
                console.error('Error getStoreInfo : ', error);
            }
        },
        async getPostInfo() {
            this.storeId = this.$route.params.storeId;
            console.log("this.storeId : ", this.storeId);
            try {
                const response = await axios.get(`http://${locohost}/posts/getPostList?storeId=${this.storeId}`);
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                this.postInfoList = DBdata.postInfoList
                console.log('this.postInfoList:', this.postInfoList);
            } catch (error) {
                console.error('Error getPostInfo() : ', error);
            }
        },
        goToPostView(postId) {
            console.log('postId:', postId);
            this.goToPostpostId = postId;
            this.$router.push({
                name: "postView",
                query: { value: this.goToPostpostId }
            });
        },
        resetPost() {
            this.postTitle = "";
            this.description = "";
            this.picture = null;
            this.showCreatePost = false;
        },
        async createPost() {

            const formData = new FormData();
            formData.append('storeId', this.storeId);
            formData.append('postTitle', this.postTitle);
            formData.append('description', this.description);
            formData.append('picture', this.picture);
            formData.append('locationCity', this.storeInfo.locationCity);

            console.log("this.storeId", this.storeId);
            console.log("this.postTitle", this.postTitle);
            console.log("this.description", this.description);
            console.log("this.picture", this.picture);
            console.log("this.storeInfo.locationCity", this.storeInfo.locationCity);
            console.log("formData : ", formData);

            axios.post(`http://${locohost}/posts/create`, formData,
                {
                    withCredentials: true,
                })
                .then((response) => {
                    console.log(response);
                    console.log("发布贴文:", this.postTitle);
                    // 发布后可以隐藏创建贴文的页面
                    this.showCreatePost = false;
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.status == 401) {
                        alert("你尚未登入");
                    }
                });

            // console.log("发布贴文:", this.description);
            // // 发布后可以隐藏创建贴文的页面
            // this.showCreatePost = false;
        },
        handleFileChange(event) {
            this.picture = event.target.files[0];
            let wrapper = this.$refs.wrapper;
            let img = this.$refs.img;
            if (this.picture) {
                // creatiing new file reader
                let reader = new FileReader();
                //once reader loads the file
                reader.onload = function () {
                    //getting reader result
                    let result = reader.result;
                    //passing reader result to image source
                    img.src = result;
                    //adding active class to wrapper
                    wrapper.classList.add("active");
                }
                reader.readAsDataURL(this.picture)
            }
            //display file name
            let regExp = /[^\\]*$/;
            let fileName = this.$refs.fileName;
            if (event.target.value) {
                let valueStore = event.target.value.match(regExp);
                fileName.textContent = valueStore;
            }
        },
        simulateFileInputClick() {
            this.$refs.fileInput.click(); // 触发文件输入框的点击事件
        }
    },
    computed: {
        // ...mapState(indexState, ["piniaStoreInfo"]),
    },
};
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
                    <!-- 預設未登入頭貼 -->
                    <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="showFnList">
                    <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="showFnList">
                        <!-- 登入顯示 -->
                        <ul v-if="this.isLogIn">
                            <li @click="goToUserInfoPage">個人資料</li>
                            <li @click="goToUserPostPage">個人貼文</li>
                            <li @click="logout()">登出</li>
                        </ul>
                        <!-- 未登入顯示 -->
                        <ul v-if="!this.isLogIn">
                            <li @click="login()" >登入</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 店家資訊 -->
        <div class="storeCard1">
            <div class="storePhoto">
                <img :src="(`../../../${storeInfo.filePath}`)" v-if="storeInfo.filePath">
                <!-- 預設店家圖片 -->
                <img src="../../main/resources/static/images/project_noPicture.png" alt="" v-else>
            </div>
            <div class="storeInfoArea">
                <span class="storeTitle">{{ this.storeInfo.name }}</span>
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
        <!-- 創建貼文按鈕 -->
        <div class="createBtnArea">
            <button class="createBtn" aria-label="建立貼文" data-balloon-pos="up" @click="showCreatePost = true"><i
                    class="fa-solid fa-plus"></i></button>
        </div>
        <!-- 創建貼文 -->
        <div class="createPost" v-if="showCreatePost">
            <div class="overlay">
                <textarea class="postTitle" v-model="postTitle" placeholder="貼文標題"></textarea>
                <textarea class="description" v-model="description" placeholder="貼文內容"></textarea>

                <div class="imgArea">
                    <div ref="wrapper" class="wrapper">
                        <div class="image">
                            <img ref="img" src="" alt="">
                        </div>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div class="text">尚未選取圖片</div>
                        </div>
                        <div ref="fileName" class="fileName"></div>
                    </div>
                    <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" hidden />
                    <button class="selectImgBtn" @click="simulateFileInputClick">上傳圖片</button>
                </div>

                <div class="btnArea">
                    <button class="btn" @click="showCreatePost = false, resetPost()">取消</button>
                    <button class="btn" @click="createPost()">建立</button>
                </div>
            </div>
        </div>
        <!-- 店家貼文 -->
        <div class="postArea">
            <span class="line">關於<span>{{ storeInfo.name }}</span>的貼文</span>
            <div class="post" v-for="(post, index) in this.postInfoList">
                <p class="postTitle">{{ post.description }}</p>
                <button class="moreBtn" @click="goToPostView(post.postId)">More...</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped >
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    // font-family: "Poppins", sans-serif;
}
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

                .userBtn {
                    border: none;
                    border-radius: 50%;
                    width: 55px;
                    height: 55px;
                    padding: 0;
                    cursor: pointer;
                }

                .userFnList {
                    /* display: none; */
                    overflow: hidden;
                    max-height: 0;
                    position: fixed;
                    top: 90px;
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
                        max-height: 100px;
                        transition: max-height .3s ease-in;
                        display: flex;
                        justify-content: center;
                    }
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
// body {
//     background: #F9E8D9;
// }

.bgArea {
    // padding: 10% 5% 0;
    width: 100VW;
    display: flex;
    flex-direction: column;
    align-items: center;

    .storeCard1,
    .postArea {
        width: 60%;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        display: flex;
    }

    //店家資訊
    .storeCard1 {
        height: 150px;
        margin: 20px 0;

        .storePhoto {
            width: 40%;
            max-height: 100%;
            /* 最大高度為父元素的100% */
            padding: 10px;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            object-fit: cover;
            /* 圖片填滿整個區域，可能裁切部分內容 */
        }

        .storeInfoArea {
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
                color: #527853;
            }
        }
    }

    //創建貼文按鈕
    .createBtnArea {
        position: fixed;
        bottom: 70px;
        right: 70px;

        .createBtn {
            background: #fff;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            margin: 0 10px;
            position: relative;
            display: inline-flex;
            transition: all 0.3s;
            box-shadow: -3px -3px 7px #f6f6f6, 0 0 7px rgba(0, 0, 0, 0.2);
            cursor: pointer;

            &:hover {
                transform: scale(1.1);
            }
        }

        i {
            position: relative;
            text-align: center;
            width: 100%;
            height: 100%;
            font-size: 23px;
            line-height: 50px;
            color: #EE7214;
            font-weight: bolder;

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    //創建貼文
    .createPost {
        width: 100%;
        height: 100vh;
        background-color: rgb(0, 0, 0, 0.7);
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;

        .overlay {
            width: 60%;
            // height: 70vh;
            background-color: white;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px 25px;
            overflow-y: visible;

            textarea {
                width: 90%;
                resize: none;
                overflow-y: visible;
                margin: 5px 0;
                padding: 5px;
                color: #527853;
                font-weight: bolder;
                font-size: 20px;
                text-indent: 20px;
                border: 2px solid gray;
                border-radius: 10px;

            }

            .postTitle {
                height: 40px;
            }

            .description {
                height: 80px;
            }

            .imgArea {
                height: 300px;
                width: 90%;
                position: relative;
                margin-top: 5px;
                // border: 2px dashed red;

                .wrapper {
                    width: 100%;
                    height: 250px;
                    position: relative;
                    border: 2px dashed gray;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;

                    .image {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        display: none;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        .icon {
                            font-size: 100px;
                            color: #EE7214;
                        }

                        .text {
                            font-size: 20px;
                            font-weight: bolder;
                            color: #EE7214;
                        }
                    }

                    .fileName {
                        position: absolute;
                        bottom: 0;
                        display: none;
                        width: 100%;
                        padding: 8px;
                        font-size: 12px;
                        font-weight: bolder;
                        background: linear-gradient(135deg, #EE7214 0%, #F7B787 100%);
                    }
                }

                .wrapper {
                    &.active {
                        border: none;

                        .image {
                            display: block;
                        }

                        &:hover {
                            .fileName {
                                display: block;
                            }
                        }
                    }
                }

                .selectImgBtn {
                    display: block;
                    margin-top: 10px;
                    width: 100%;
                    height: 25px;
                    cursor: pointer;
                    outline: none;
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: bolder;
                    background: linear-gradient(135deg, #EE7214 0%, #F7B787 100%);
                }
            }

            .btnArea {
                .btn {
                    margin: 0 10px;
                    background-color: #EE7214;
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: large;
                    width: 80px;
                    height: 40px;
                    font-weight: bolder;

                    &:hover {
                        background-color: #ea8436c0;
                    }
                }
            }
        }
    }

    //店家貼文
    .postArea {
        margin-top: 10px;
        padding: 15px 0;
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

        // .line:before,
        // .line:after {
        //     content: "";
        //     position: absolute;
        //     top: 55%;
        //     background: #527853;
        //     width: 100px;
        //     height: 2px;
        // }

        // .line:before {
        //     left: -50%;
        // }

        // .line:after {
        //     right: -50%;
        // }

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
                background-color: #EE7214;
                border: none;
                border-radius: 5px;
                color: white;
                font-weight: bolder;
                cursor: pointer;
            }
        }
    }
}</style>