<script>
import axios from "axios";
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            updateImgPage: false,
            updatePwdPage: false,
            picture: null,
            loginState: {},
            usersEntity: {},
            isLogIn: false,
            isFnListVisible: false,
            inputValue: "",//搜尋欄輸入值
            loginUserPicture: "",
            userInfoForPassword:{
                oldPassword:null,
                newPassword:null,
                repeatNewPassword:null
            }
        }
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
        goToCreateStorePage() {
            this.$router.push("/AddStore");
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
        //變更頭貼
        async updateImage() {
            try {
                const formData = new FormData();
                formData.append('userId', this.loginUserId);
                formData.append('picture', this.picture);

                // 使用 axios.post 發送 POST 請求
                const response = await axios.post(`http://${locohost}/users/updateHeadshot`, formData, {
                    withCredentials: true, // 如果需要跨域携带 cookie
                    headers: {
                        'Content-Type': 'multipart/form-data', // 設定 Content-Type 為 multipart/form-data
                    },
                });

                console.log(response); // 檢查伺服器回傳的 response

                if (response.status === 200) {
                    console.log('Headshot updated successfully!');
                    this.updateImgPage = false;
                    location.reload();
                } else {
                    console.error('Error updating headshot:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
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
            this.$refs.fileInput.click(); // 觸發文件輸入框的點擊事件
        },
        //變更密碼
        updatePwd() {
            if(this.userInfoForPassword.newPassword != this.userInfoForPassword.repeatNewPassword){
                    //alert("新密碼不一致");
                    Swal.fire({
                        icon: "error",
                        title: "新密碼不一致",
                    });
                    return -1;
                }
            axios.post(`http://${locohost}/users/currentUser/updatePassword`,
            {
                oldPassword:this.userInfoForPassword.oldPassword,
                newPassword:this.userInfoForPassword.newPassword
            }, 
            {
                withCredentials: true,
            })
            .then(response => {
                console.log(response);
                if(response.status == 200){
                    // alert("修改成功");
                    Swal.fire({
                        icon: "success",
                        title: "修改成功",
                        showConfirmButton: true,
                    });
                    // 關閉視窗
                    this.updatePwdPage = false
                    // 跳轉頁面
                    this.$router.push("/login");
                    return -1;
                }
            })
            .catch(error =>{
                console.log(error);
                if(error.response.status == 400){
                    // alert("請求錯誤");
                    Swal.fire({
                        icon: "error",
                        title: "請求錯誤",
                    });
                }
            });
        },
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
                    <div class="userPhoto">
                        <div style="width: 100px; height: auto; font-size:larger; color: white;"><span class="userHeaderName">您好! {{ loginUserName }}</span></div>
                        <!-- 登入者圖片有效，顯示圖片；否則顯示默認圖片 -->
                        <img class="userBtn" :src="getImage(loginUserPicture)" alt="" @mouseenter="this.showFnList"
                            v-if="getImage(loginUserPicture) && this.isLogIn">
                        <!-- 預設未登入頭貼 -->
                        <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="this.showFnList" v-else>
                        <!-- 登入者圖片下拉選單 -->
                        <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="showFnList">
                            <!-- 登入顯示 -->
                            <ul v-if="this.isLogIn">
                                <li style="color: #527853; cursor: default;">個人資料</li>
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

        <div class="userArea">
            <!-- 會員頭像 -->
            <div class="updateUserPhoto">
                <!-- 登入者圖片有效，顯示圖片；否則顯示默認圖片 -->
                <img class="userImg" :src="getImage(loginUserPicture)" alt="" @mouseenter="this.showFnList"
                    v-if="getImage(loginUserPicture) && this.isLogIn">
                <!-- 預設未登入頭貼 -->
                <img class="userImg" src="../sally/explorer.png" alt="" @mouseenter="this.showFnList" v-else>
                <button class="updateBtn" @click="updateImgPage = true">變更頭像</button>
            </div>

            <!-- 會員資訊 -->
            <div class="userInfo">
                <p>
                    <i class="fa-solid fa-user"></i>
                    會員姓名：{{ loginUserName }}
                </p>
                <p>
                    <i class="fa-solid fa-envelope"></i>
                    會員信箱：{{ loginUserEmail }}
                </p>
                <p>
                    <i class="fa-solid fa-lock"></i>
                    會員密碼： <button class="updateBtn" @click="updatePwdPage = true">變更密碼</button>
                </p>
            </div>

            <!-- 更換頭像彈框 -->
            <div class="overlay" v-if="updateImgPage">
                <div class="updateArea">
                    <div class="insideArea">
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
                        <button class="selectImgBtn" @click="simulateFileInputClick">
                            上傳圖片
                        </button>
                    </div>

                    <div class="btnArea">
                        <button class="cancel btn" @click="updateImgPage = false">取消</button>
                        <button class="update btn" @click="updateImage">確定</button>
                    </div>
                </div>
            </div>

            <!-- 更換密碼彈框 -->
            <div class="overlay" v-if="updatePwdPage">
                <div class="updateArea">
                    <div class="insideArea inputArea" style="width: 90%">
                        <label for="oldPwd">舊密碼：</label>
                        <input type="text" id="oldPwd" placeholder="請輸入舊密碼" v-model="userInfoForPassword.oldPassword" />
                        <label for="newPwd">新密碼：</label>
                        <input type="text" id="newPwd" placeholder="請輸入新密碼" v-model="userInfoForPassword.newPassword" />
                        <label for="checkPwd">確認新密碼：</label>
                        <input type="text" id="checkPwd" placeholder="請再次確認密碼" v-model="userInfoForPassword.repeatNewPassword" />
                    </div>
                    <div class="btnArea">
                        <button class="cancel btn" @click="updatePwdPage = false">取消</button>
                        <button class="update btn" @click="updatePwd">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
    
<style lang="scss" scoped>
@media screen and (max-width: 600px) {
    .bgArea .headerArea .fixed .searchArea[data-v-0fcee7fe] {
        width: 50%; 
    }
    .RWD{
        display: none;
    }
    .bgArea .headerArea .fixed .userCenterArea .userPhoto .userBtn[data-v-0fcee7fe] {
        margin-right: 0;
    }
    .bgArea .headerArea .fixed[data-v-0fcee7fe] {
        justify-content: space-evenly;
    }
    .userHeaderName{
        display: none;
    }

    .bgArea .headerArea .fixed .userCenterArea .userPhoto .userFnList[data-v-0fcee7fe] {
        right: 1%;
    }
    .bgArea .userArea[data-v-0fcee7fe] {
        flex-direction: column;
    }
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.bgArea {
    width: 100vw;
    height: 100vh;
    display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-direction: row;
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

    .userArea {
        width: 100vw;
        height: calc(100vh - 80px);
        display: flex;
        justify-content: center;
        align-self: center;

        .updateUserPhoto {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-left: 200px;

            .userImg {
                width: 250px;
                height: 250px;
                border-radius: 250px;
                // border: 2px dashed gray;
                position: relative;
                transform: translateY(10px);
            }

            button {
                position: relative;
                transform: translateY(35px);
            }
        }

        .userInfo {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
            padding-left: 50px;
            padding-right: 150px;

            p {
                font-size: larger;
                font-weight: bolder;
                color: #527853;
                display: flex;
                margin: 15px 0;
            }

            i {
                margin-right: 10px;
                display: inline-block;
                width: 20px;
                height: 20px;
                text-align: center;
                position: relative;
                transform: translateY(5px);
            }

            button {
                position: relative;
                transform: translateY(-3px);
            }
        }

        .updateBtn {
            border: none;
            margin: 0 10px;
            background-color: #679f6a;
            border: none;
            border-radius: 10px;
            color: white;
            font-size: large;
            width: 100px;
            height: 35px;
            font-weight: bolder;
            cursor: pointer;

            &:hover {
                background-color: #527853b7;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            }
        }

        .overlay {
            width: 100%;
            height: 100vh;
            background-color: rgb(0, 0, 0, 0.7);
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99;

            .updateArea {
                width: 40%;
                height: 70vh;
                background-color: white;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 10px 25px;
                overflow-y: visible;
            }

            .insideArea {
                height: 300px;
                width: 90%;
                position: relative;
                margin-top: 5px;
            }
        }

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

            &.active {
                border: none;

                .image {
                    display: block;
                    height: 100%;
                    width: auto;
                }

                &:hover {
                    .fileName {
                        display: block;
                    }
                }
            }

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
                    color: #527853;
                }

                .text {
                    font-size: 20px;
                    font-weight: bolder;
                    color: #527853;
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
                background: linear-gradient(135deg, #527853 0%, #679f6a 100%);
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
            background: linear-gradient(135deg, #527853 0%, #679f6a 100%);
        }

        .btnArea {
            .cancel {
                background-color: #c0c0c0;

                &:hover {
                    background-color: #c0c0c0a7;
                }
            }

            .update {
                background-color: #527853;
                margin-left: 20px;

                &:hover {
                    background-color: #527853c4;
                }
            }


            .btn {
                margin: 30px 10px 0 10px;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: large;
                width: 80px;
                height: 40px;
                font-weight: bolder;
                cursor: pointer;
            }
        }

        .inputArea {
            display: block;
            flex-direction: column;
            justify-content: center;

            label {
                font-size: larger;
                font-weight: bolder;
                color: #527853;
            }

            input {
                width: 100%;
                outline-style: none;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 5px;
                font-size: medium;
                font-weight: 700;
                color: #679f6a;
                margin-bottom: 20px;

                &::placeholder {
                    color: #ccc;
                }

                &:hover {
                    border-color: #527853;
                    outline: 0;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                        0 0 8px #527853c4;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #527853c4;
                }
            }

            .code {
                width: 60%;
            }

            .btn {
                margin-left: 25px;
                background-color: #527853;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: large;
                width: 140px;
                height: 30px;
                font-weight: bolder;

                &:hover {
                    background-color: #527853c4;
                }
            }
        }
    }
}
</style>
    