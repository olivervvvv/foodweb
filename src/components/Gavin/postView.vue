<!-- 顯示單一貼文 -->
<script>
import axios from 'axios';
export default {
    data() {
        return {
            postData: {},
            commentData: {},
            postId: 0,
            storeId: 0,
            imgurl: "",
            likeNumber: 0,
            description: "",
            postTitle: "",
            storeId: 0,
            userId: 0,
            showcomment: false,
            commentInput: "",

            comments: "",
            InputValue: "",
            isLogIn: false,
            imgB64: "",
            userPicture: "",
            userCommentPicture: "",
            user: {},
            userName: "",
        }
    },
    components: {
    },
    mounted() {
        this.getPost();
        this.logInCheck();
        //设置一个定时器每2秒执行一次,讀取最新留言
        this.commentInterval = setInterval(() => {
            if (this.showcomment) {
                this.showComment(this.postId, this.storeId);
            }
        }, 2000);



    },
    beforeDestroy() {
        // 在组件销毁前清除定时器，避免内存泄漏
        clearInterval(this.commentInterval);
    },
    methods: {
        //轉換圖片
        getImage(picture) {
            // 如果 picture 為 undefined，返回一個空字符串
            if (!picture) {
                return "";
            }
            // 直接返回 Base64 Data URL
            return "data:image/jpeg;base64," + picture;
        },
        async getPost() {
            console.log("傳入之資料: ", this.$route.query.value);
            try {
                const response = await axios.get(`http://${locohost}/posts/getPost?postId=${this.$route.query.value}`);
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                this.postData = DBdata; // 更新組件的數據
                console.log('this.postData from DB:', this.postData);
                //設定貼文內容
                this.description = this.postData.postInfo.description;
                this.imgurl = this.postData.postInfo.filePath;
                this.imgB64 = this.postData.postInfo.picture;
                this.postId = this.postData.postInfo.postId;
                this.likeNumber = this.postData.postInfo.postLikeNumber;
                this.postTitle = this.postData.postInfo.postTitle;
                this.storeId = this.postData.postInfo.storeId;
                this.userId = this.postData.postInfo.userId;
                //顯示前兩筆留言
                this.comments = await this.getTopTwoComments(DBdata.postInfo.postId);
                console.log('this.comments :', this.comments);
                //顯示發文者頭像
                this.userPicture = await this.getUserPicture(this.postData.postInfo.userId);
                // console.log('this.userPicture:', this.userPicture);

            } catch (error) {
                console.error('Error getPostInfo() : ', error);
            }
        },
        //顯示前兩筆留言函數
        async getTopTwoComments(postId) {
            try {
                const response = await axios.get(`http://${locohost}/posts/${postId}/comments`, {
                    withCredentials: true,
                });
                const comments = response.data;
                return comments.slice(0, 2); // 返回前兩條評論
            } catch (error) {
                console.error('Error fetching comments:', error);
                return [];
            }
        },
        //用userId獲取使用者頭像和名子
        async getUserPicture(userId) {
            try {
                const response = await axios.get(`http://${locohost}/public/users/${userId}`, {
                    withCredentials: true,
                });
                const userData = response.data;
                console.log('userData :', userData);

                //根據userId回傳user的名子
                this.user = userData;
                this.userName = userData.name;
                console.log('this.user:', this.userName);
                //根據userId回傳user的頭像
                if (userData.picture != null) {
                    return ("data:image/jpeg;base64," + userData.picture);
                } else {
                    return "";
                }
            } catch (error) {
                console.error('Error getUserPicture:', error);
            }
            this.user = null;
            this.userName = null;
        },
        // 檢查是否已登入
        async logInCheck() {
            try {
                const response = await axios.get(`http://${locohost}/users/getcurrentUser`, {
                    withCredentials: true,
                });
                var loginState = response.data;
                console.log('loginState from DB:', loginState);
                this.isLogIn = loginState.login;
                console.log("this.isLogIn : ", this.isLogIn)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },
        // 顯示完整留言
        async showComment(postId, storeId) {
            //判斷是否登入
            await this.logInCheck();
            console.log("logInCheck : ", this.isLogIn)
            if (!this.isLogIn) {
                alert('請先登入');
                return;
            }
            //顯示留言邏輯
            this.showcomment = true;
            this.postId = postId;
            this.storeId = storeId;
            console.log('postId  :', postId);
            console.log('storeId :', storeId);
            try {
                const getComment = await axios.get(`http://${locohost}/posts/${postId}/comments`);
                const Comment = getComment.data;
                console.log('Comment from DB:', Comment);
                this.commentData = getComment.data;
                console.log('this.commentData from DB:', this.commentData);
            } catch (error) {
                console.error('Error in the second request:', error);
            }
        },
        // //顯示留言者頭像
        // async getUserCommentPicture(userId) {
        //     const response =await  axios.get(`http://${locohost}/public/users/${userId}`, {
        //             withCredentials: true,
        //         });
        //         const userData = response.data;
        //         console.log('userData:', userData);
        //         // 确保 this.getImage 返回一个 Promise，否则无法使用 await
        //         const imageData =  this.getImage(userData.picture);
        //         // console.log('Image Data:', imageData);
        //         this.userCommentPicture = imageData;
        //         // console.log('this.userCommentPicture:', this.userCommentPicture);
        //         return imageData;
        // },
        //===================================================================================================================================
        //處理點讚邏輯
        async clickLike(post) {
            //改變like樣式
            post.isLiked = !post.isLiked;
            // 假設你的 post 對象中有一個屬性用於跟蹤先前的顏色
            const previousColor = post.previousColor || '#000000';
            // 更新顏色屬性
            post.previousColor = post.isLiked ? '#ff0000' : '#000000';
            // 如果從 #ff0000 變為 #000000，則輸出 1；如果從 #000000 變為 #ff0000，則輸出 -1
            const output = (previousColor === '#000000' && post.previousColor === '#ff0000') ? 1 :
                (previousColor === '#ff0000' && post.previousColor === '#000000') ? -1 : 0;
            console.log('output:', output);
            try {
                const response = await axios.post(`http://${locohost}/posts/getPostLike?postId=${post.postInfo.postId}&addNumber=${output}`);
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                //更改Like值
                this.likeNumber = response.data.postInfo.postLikeNumber;
            } catch (error) {
                console.error('Error fetching Like data:', error);
            }
        },
        // 送出留言邏輯
        async sendComment(postId, storeId) {
            console.log('commentInput:', this.commentInput);
            console.log('postId  :', postId);
            console.log('storeId :', storeId);
            const commentData = {
                postId: postId,
                storeId: storeId,
                comment: this.commentInput,
            };
            try {
                const response = await axios.post(`http://${locohost}/users/currentUser/comment`, commentData, {
                    withCredentials: true,
                });
                const DBdata = response.data;
                console.log('postData from DB:', DBdata);
            } catch (error) {
                console.error('Error registering user:', error);
            }

            this.commentInput = "";
            await this.showComment(postId, storeId); // 等待 showComment 完成
            this.updateComments();
        },
        // 在每次評論數據更新時將滑桿固定到底部
        updateComments() {
            // 將滑桿固定到底部
            this.$refs.commentContainer.scrollTop = this.$refs.commentContainer.scrollHeight;
            // // 尋找最後一個評論元素
            // const lastComment = this.$refs.commentContainer.lastElementChild;
            // if (lastComment) {
            // // 滾動條滾動到最後一個評論元素
            // lastComment.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // }
        },
        //返回上一頁
        goBack() {
            this.$router.back();
        }
    },
}

</script>

<template>
    <div class="post-container" style="user-select: none;">
        <!-- 該篇貼文 -->
        <div class="instagram-post">
            <!-- 發文者頭像及名字 -->
            <div class="header">
                <figure>
                    <!-- 發文者圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img :src="this.userPicture" v-if="this.userPicture">
                    <!-- 預設發文者圖片 -->
                    <img src="../../main/resources/static/images/explorer.png" v-else>
                </figure>
                <!-- 讀取發文者名字 -->
                <span class="username" v-if="this.user && this.userName != null">{{ this.userName }}</span>
                <span class="username" v-else>UserName</span>
            </div>
            <!-- 貼文內容 -->
            <div class="content">
                <figure>
                    <!-- 如果圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img :src="getImage(this.imgB64)" v-if="imgB64">
                    <img :src="imgurl" v-if="imgB64 === null">
                    <!-- 預設貼文圖片 -->
                    <img src="../../main/resources/static/images/error 404.png" v-if="imgB64 === null && imgurl === ''">
                </figure>
                <!-- <span class="username">username</span> -->
                <p>{{ this.description }}</p>
            </div>
            <!-- Like按鈕 -->
            <div class="heart">
                <i v-if="!this.postData.isLiked" class="fa-regular fa-heart fa-lg" style="color: #000000;"
                    @click="clickLike(postData)"></i>
                <i v-if="this.postData.isLiked" class="fa-solid fa-heart fa-lg" style="color: #ff0000;"
                    @click="clickLike(postData)"></i>
                <span class="likes">{{ this.likeNumber }}</span>
            </div>
            <!-- 預覽前兩筆留言 -->
            <div class="comment-preview">
                <div class="comment" v-for="(comment, cIndex) in this.comments" :key="cIndex">
                    <span class="userName">{{ comment.postComment.name }}</span>
                    <p>{{ comment.postComment.comment }}</p>
                </div>
                <!-- 顯示完整評論btn -->
                <button class="showCommentBtn" @click="showComment(this.postId, this.storeId)">查看更多評論</button>
            </div>
        </div>
        <!-- 跳出完整評論頁面 -->
        <div v-if="showcomment" class="blur-background">
            <div class="comment-container">
                <!-- 關閉視窗 -->
                <div class="closeComment">
                    <button class="closeBtn" @click="showcomment = false"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <!-- 顯示評論區域 -->
                <div ref="commentContainer" class="comment-text-container">
                    <!-- 有評論顯示 -->
                    <div class="content" v-for="(comment, index) in commentData" v-if="commentData.length > 0">
                        <div class="userComment">
                            <!-- 留言者頭像 -->
                            <figure>
                                <!-- 留言者圖片有效，顯示圖片；否則顯示默認圖片 -->
                                <img :src="getImage(comment.userPicture)" v-if="getImage(comment.userPicture)">
                                <!-- 預設留言者圖片 -->
                                <img src="../../main/resources/static/images/explorer.png" v-else>
                            </figure>
                            <span>{{ comment.postComment.name }}</span>
                        </div>
                        <p>{{ comment.postComment.comment }}</p>
                    </div>
                    <!-- 無評論顯示 -->
                    <div v-else class="no-content">
                        <span>目前暫無評論</span>
                    </div>
                </div>
                <!--  留言評論區域 -->
                <div class="leaveComments">
                    <!-- 輸入區域 -->
                    <div class="inputArea">
                        <textarea name="commentInput" placeholder="發表評論..." v-model="commentInput"></textarea>
                        <button class="btn" :class="{ 'activeBtn': commentInput }"
                            @click="sendComment(this.postId, this.storeId)" :disabled="!commentInput"><i
                                class="fa-solid fa-paper-plane"></i></button>
                    </div>
                    <!-- 按鈕區域 -->
                    <!-- <div class="btnArea">
                        <button class="cancel btn" @click="showcomment = false">取消</button>
                        <button class="submit btn" @click="sendComment(this.postId, this.storeId)" ><i class="fa-solid fa-paper-plane"></i></button>
                    </div> -->
                </div>
            </div>
        </div>
        <!-- 返回上頁按鈕 -->
        <div class="goBackArea">
            <button class="goBackBtn" aria-label="返回上頁" data-balloon-pos="left" @click="goBack()"><i
                    class="fa-solid fa-reply"></i></button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.post-container {
    width: 100vw;
    display: flex;
    justify-content: center;
    padding: 30px 0;

    //該篇貼文
    .instagram-post {
        width: 50%;
        padding: 2%;
        background-color: white;
        border-radius: 10px;

        //發文者頭像及名字
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            figure {
                height: 40px;
                width: 40px;

                img {
                    height: auto;
                    width: 100%;
                    border-radius: 50%;
                }
            }

            span {
                margin-left: 10px;
                font-size: 1.1em;
                font-weight: bolder;
            }
        }

        //貼文內容
        .content {
            margin-bottom: 10px;

            img {
                height: 100%;
                width: 100%;
                border-radius: 10px;
            }

            p {
                font-size: 1.1em;
            }
        }

        //Like按鈕
        .heart {
            display: flex;
            align-items: center;
            padding: 5px 0;
            border-top: 1px solid rgb(200, 200, 200);
            border-bottom: 1px solid rgb(200, 200, 200);

            i {
                cursor: pointer;
            }

            .likes {
                margin-left: 10px;
                font-size: 1.1em;
            }
        }

        //預覽前兩筆留言
        .comment-preview {
            margin-top: 10px;

            .comment {
                margin: 10px 0;

                .userName {
                    font-weight: bolder;
                }
            }

            .showCommentBtn {
                width: 100%;
                padding: 10px;
                background: none;
                font-size: 1em;
                color: gray;
                border: none;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                    font-weight: bold;
                }
            }
        }
    }

    //跳出完整評論頁面
    .blur-background {
        border: 1px solid red;
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
        align-items: center;
        justify-content: center;

        .comment-container {
            width: 50%;
            height: 80%;
            z-index: 99;
            background-color: #ffffff;
            border-radius: 10px;
            // position: fixed;
            // // top: 10%;
            /* 距離頂部的距離，根據需要調整 */
            // overflow: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            /* 添加陰影 */

            .closeComment {
                width: 100%;
                height: 10%;
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

            .comment-text-container {
                width: 100%;
                height: 70%;
                padding: 0 5% 5% 5%;
                overflow: auto;
                box-shadow: 0px -5px 5px -5px rgba(0, 0, 0, 0.5);

                .content {
                    margin: 2% 0;

                    .userComment {
                        display: flex;
                        align-items: center;

                        figure {
                            height: 32px;
                            width: 32px;

                            img {
                                height: auto;
                                width: 100%;
                                border-radius: 50%;
                            }
                        }

                        span {
                            font-weight: bold;
                            margin-left: 2%;
                        }
                    }

                    p {
                        margin-left: calc(2% + 32px);
                    }
                }

                .no-content {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    span {
                        font-weight: bold;
                        font-size: 20pt;
                        color: gray;
                    }
                }
            }

            .leaveComments {
                padding: 10px 0;
                box-shadow: 0px -5px 5px -5px rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 20%;
                display: flex;
                justify-content: center;
                align-items: center;

                .inputArea {
                    width: 90%;
                    height: 80%;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #F0F2F5;

                    textarea {
                        resize: none;
                        width: 90%;
                        height: 100%;
                        outline-style: none;
                        padding: 20px 10px;
                        font-size: 1em;
                        font-weight: bolder;
                        color: #EE7214;
                        background: none;
                        border: none;

                        &::placeholder {
                            color: gray;
                        }

                        // &:hover {
                        //     border-color: #EE7214;
                        //     outline: 0;
                        //     -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                        //         0 0 8px #ee7214b2;
                        //     box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #ee7214b2;
                        // }
                    }

                    //無評論時
                    .btn {
                        color: gray;
                        font-size: 1.5em;
                        background: none;
                        border: none;
                        margin-right: 10px;
                    }

                    //有輸入評論時
                    .activeBtn {
                        color: #EE7214;
                        cursor: pointer;
                    }
                }

                // .btnArea {
                //     height: 50%;
                //     display: flex;
                //     align-items: center;
                //     justify-content: center;

                //     i {
                //         color: #EE7214;
                //     }

                //     .cancel {
                //         background-color: #c0c0c0;

                //         &:hover {
                //             background-color: #c0c0c0a7;
                //         }
                //     }

                //     .submit {
                //         background-color: #EE7214;
                //         margin-left: 20px;

                //         &:hover {
                //             background-color: #ee7214b2;
                //         }
                //     }

                //     .btn {
                //         border: none;
                //         border-radius: 10px;
                //         color: white;
                //         font-size: large;
                //         width: 80px;
                //         height: 40px;
                //         font-weight: bolder;
                //         cursor: pointer;
                //     }
                // }
            }
        }
    }

    //返回上頁按鈕
    .goBackArea {
        position: fixed;
        bottom: 70px;
        right: 70px;

        .goBackBtn {
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
}
</style>
