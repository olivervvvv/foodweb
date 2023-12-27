<script>
import { faL } from '@fortawesome/free-solid-svg-icons';

export default {
    data() {
        return {
            showEditPage: false,
        }
    },
    mounted() {

    },
    methods: {
        async getStoreInfo() {
            this.storeId = this.$route.params.storeId;
            console.log("this.storeId : ", this.storeId);
            try {
                const response = await axios.get(`http://${locohost}/posts/getPostByUser?userId=${this.userId}`);
                const storeData = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('storeData from DB:', storeData);
                this.storeInfo = storeData.storeInfo;
                console.log('this.storeInfoList :', this.storeInfo);
            } catch (error) {
                console.error('Error getStoreInfo : ', error);
            }
        },
    }
}
</script>

<template>
    <div class="bgArea">
        <div class="postArea">
            <span class="line">貼文</span>
            <div class="post" @click="showEditPage = true">
                <p class="postTitle">{{ "貼文標題" }}</p>
                <p class="postTitle">{{ "貼文時間" }}</p>
                <button class="btn" @click=""><i class="fa-solid fa-ellipsis"></i></button>
            </div>
        </div>

        <!-- 編輯貼文 -->
        <div class="editPageArea" v-if="showEditPage">
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
                    <button class="btn" @click="showEditPage = false">取消</button>
                    <button class="btn" @click="">建立</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    width: 100VW;
    display: flex;
    flex-direction: column;
    align-items: center;

    .postArea {
        width: 60%;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        display: flex;
        margin-top: 10px;
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