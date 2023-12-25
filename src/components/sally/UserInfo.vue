<script>
export default {
    data() {
        return {
            updateImgPage: false,
            updatePwdPage: false,
            picture: null,
        }
    },
    mounted() {

    },
    methods: {
        updateImage() {
            
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
        },
        goToMap() {
            this.$router.push({ name: "home" });
        },
        goToLogin() {
            this.$router.push({ name: "login" });
        },
        goToStorePage() {
            this.$router.push({ name: "storePage" });
        },
    },
};
</script>

<template>
    <div class="bgArea">
        <!-- 會員頭像 -->
        <div class="userPhoto">
            <img src="" alt="" />
            <button class="updateBtn" @click="updateImgPage = true">編輯頭像</button>
        </div>
        <!-- 會員資訊 -->
        <div class="userInfo">
            <p>
                <i class="fa-solid fa-user"></i>
                會員姓名：{{ "userName" }}
            </p>
            <p>
                <i class="fa-solid fa-envelope"></i>
                會員信箱：{{ "userEmail" }}
            </p>
            <p>
                <i class="fa-solid fa-lock"></i>
                會員密碼： <button class="updateBtn" @click="updatePwdPage = true">修改密碼</button>
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
                    <button class="btn" @click="updateImgPage = false">取消</button>
                    <button class="btn" @click="updateImage">確定</button>
                </div>
            </div>
        </div>

        <!-- 更換密碼彈框 -->
        <div class="overlay" v-if="updatePwdPage">
            <div class="updateArea" style="width: 40vw; height: 60vh">
                <div class="insideArea inputArea" style="width: 90%">
                    <label for="oldPwd">舊密碼：</label>
                    <input type="text" id="oldPwd" placeholder="請輸入舊密碼" />
                    <label for="newPwd">新密碼：</label>
                    <input type="text" id="newPwd" placeholder="請輸入新密碼" />
                    <label for="checkPwd">確認新密碼：</label>
                    <input type="text" id="checkPwd" placeholder="請再次確認密碼" />
                </div>
                <div class="btnArea">
                    <button class="btn" @click="updatePwdPage = false">取消</button>
                    <button class="btn" @click="">送出</button>
                </div>
            </div>
        </div>
        <div class="btnHomeAndLogOut">
            <button type="button" class="searchBtn" @click="goToStorePage()">
                回店家搜尋頁
            </button>
            <button type="button" class="searchBtn" @click="goToMap()">登出</button>
            <!-- <button type="button" class="searchBtn" @click="goToLogin()">登入</button> -->
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

// body {
//     background: #F9E8D9;
// }

.bgArea {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    .userPhoto {
        width: 40%;
        height: 100%;
        // border: 2px dashed red;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 200px;

        img {
            width: 250px;
            height: 250px;
            border-radius: 250px;
            border: 2px dashed gray;
            position: relative;
            transform: translateY(10px);
        }

        button {
            position: relative;
            transform: translateY(35px);
        }
    }

    .userInfo {
        width: 40%;
        height: 100%;
        // border: 2px dashed blue;
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
        z-index: 2;

        .updateArea {
            width: 60%;
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
        .btn {
            margin: 0 10px;
            background-color: #527853;
            border: none;
            border-radius: 10px;
            color: white;
            font-size: large;
            width: 80px;
            height: 40px;
            font-weight: bolder;

            &:hover {
                background-color: #527853c4;
            }
        }
    }

    .inputArea {
        display: flex;
        flex-direction: column;
        justify-content: center;

        label {
            font-size: larger;
            font-weight: bolder;
            color: #527853;
        }

        input {
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
    }
    .btnHomeAndLogOut{
        position: absolute;
        display: flex;
        justify-content: center;
        justify-content: space-between;
        width: 10%;
        top: 5%;
        right: 5%;
    }
}
</style>
