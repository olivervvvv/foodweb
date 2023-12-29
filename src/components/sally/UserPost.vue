<script>
import axios from "axios";
export default {
    data() {
        return {
            loginState: {},
            usersEntity: {},
            isLogIn: false,
            isFnListVisible: false,
            inputValue: "",//搜尋欄輸入值
            userId: 0, //獲取當前會員id
            postInfoList: [], //獲取該會員貼文
            showEditPage: false,
            postObj: {},
            //更新回傳給後端資料
            updatePostTitle: "",
            updateDescription: "",
            updatePicture: null,
            updateFilePath: "",

        }
    },
    mounted() {
        this.logInCheck();

    },
    methods: {
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
                this.loginState = response.data;
                console.log('loginState from DB:', this.loginState);
                this.usersEntity = response.data.usersEntity
                this.isLogIn = this.loginState.login;
                this.userId = response.data.usersEntity.userId
                console.log("this.isLogIn : ", this.isLogIn)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
            this.getUserPost(); //獲取userId後，再執行獲取該會員貼文
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
        //獲取該會員貼文
        async getUserPost() {
            console.log(this.userId)
            try {
                const response = await axios.get(`http://${locohost}/posts/getPostByUser?userId=${this.userId}`);
                this.postInfoList = response.data.postInfoList;
                console.log(this.postInfoList);
            } catch (error) {
                console.error('Error getUserPost : ', error);
            }
        },
        updatePost(post) { //編輯貼文 post從v-for="(post, index) in this.postInfoList"來的
            this.showEditPage = true
            this.postObj = JSON.parse(JSON.stringify(post)); //將原有貼文資料post給予obj。序列化 深拷貝(可以在不影響原始數據情况下進行修改和操作) 
            console.log(this.postObj)
            this.updatePostTitle = this.postObj.postTitle;
            this.updateDescription = this.postObj.description;
            this.updatePicture = this.postObj.picture;
            this.updateFilePath = this.postObj.filePath
            console.log(this.updatePicture);
            console.log(this.updateFilePath)
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
            this.updatePicture = event.target.files[0];
            let wrapper = this.$refs.wrapper;
            let img = this.$refs.img;
            if (this.updatePicture) {
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
        },
        getImage(picture) {
            // 如果 picture 為 undefined，返回一個空字符串
            if (!picture) {
                console.log("hiii")
                return "";
            }
            // 直接返回 Base64 Data URL
            console.log("hi")
            return "data:image/jpeg;base64," + picture;
        },
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
                        <!-- 預設未登入頭貼 -->
                        <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="showFnList">
                        <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="showFnList">
                            <!-- 登入顯示 -->
                            <ul v-if="this.isLogIn">
                                <li style="color: #527853; cursor: default;">個人資料</li>
                                <li @click="goToUserPostPage">個人貼文</li>
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
        <div class="postArea">
            <span class="line">{{ usersEntity.name }}的所有貼文</span>
            <div class="post" @click="updatePost(post)" v-for="(post, index) in this.postInfoList">
                <p class="postTitle">{{ post.postTitle }}</p>
                <p class="postTitle">{{ post.postUpdateTime }}</p>
                <!-- <button class="btn" @click=""><i class="fa-solid fa-ellipsis"></i></button> -->
            </div>
        </div>

        <!-- 編輯貼文 -->
        <div class="editPageArea" v-if="showEditPage">
            <div class="overlay">
                <textarea class="postTitle" v-model="updatePostTitle" placeholder="貼文標題"></textarea>
                <textarea class="description" v-model="updateDescription" placeholder="貼文內容"></textarea>

                <div class="imgArea">
                    <div ref="wrapper" class="wrapper">
                        <div class="image">
                            <img ref="img" :src="updatePicture ? getImage(updatePicture) : updateFilePath"
                                style="height: 100%; width: 100%;" />
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
                    <button>刪除此篇貼文</button>
                    <button class="btn" @click="showEditPage = false">取消更新</button>
                    <button class="btn" @click="">更新</button>
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
    // height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
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
                            max-height: 100px;
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

    .postArea {
        width: 60%;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        display: flex;
        margin-top: 40px;
        padding: 15px 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
            margin: 15px 0;
            font-size: 20px;
            font-weight: bolder;
            color: #527853;
            position: relative;
        }

        .post {
            width: 95%;
            height: 40px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
            padding: 0 10px;

            .postTitle {
                font-weight: bolder;
            }

            .btn {
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

    .editPageArea {
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
}
</style>