<!-- 登入後顯示此畫面 -->
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            isFnListVisible: false,//header需要
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
            inputValue: "",//搜尋欄輸入值
            isLogIn: false,//登入狀態

            items: [], // Array to store loaded content
            loading: false,
            page: 0,
            loginUserPicture: "",
        }
    },
    components: {
    },
    mounted() {
        this.loadContent();
        window.addEventListener("scroll", this.handleScroll);
        // this.getPost();
        this.setInputValue();
        this.logInCheck();
        // 设置一个定时器每2秒执行一次,讀取最新留言
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
        getImage(picture) {
            // 如果 picture 為 undefined，返回一個空字符串
            if (!picture) {
                return "";
            }
            // 直接返回 Base64 Data URL
            return "data:image/jpeg;base64," + picture;
        },
        // 計算日期時間
        formatCommentUpTime(dateTimeString) {
            const currentDate = new Date();
            const commentDate = new Date(dateTimeString);
            // 計算時間差（毫秒）
            const timeDifference = currentDate - commentDate;
            // 計算相對時間
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            if (days > 0) {
            return `${days} 天前`;
            } else if (hours > 0) {
            return `${hours} 小時前`;
            } else if (minutes > 0) {
            return `${minutes} 分鐘前`;
            } else {
            return `${seconds} 秒前`;
            }
        },
        async loadContent() {
            this.loading = true;
            try {
                // Make an API request using Axios
                const response = await axios.get(`http://${locohost}/posts/getNewPosts?page=${this.page}`);
                console.log(response.data);
                this.postData = response.data.commVoList; // 更新組件的數據
                console.log('this.postData from DB:', this.postData);
                if (this.postData.length > 0) {
                    // Append the new items to the existing items array
                    this.items = [...this.items, ...this.postData];
                    // Increment the page number
                    this.page++;
                    console.log('this.page:', this.page);
                }

                // 遍歷每個帖子，獲取前兩條評論
                for (const post of this.postData) {
                    post.comments = await this.getTopTwoComments(post.postInfo.postId);
                }


            } catch (error) {
                console.error('Error loading content:', error);
            } finally {
                this.loading = false;
            }
        },
        handleScroll() {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.offsetHeight - 100 &&
                !this.loading
            ) {
                this.loadContent();
            }
        },
        //點擊logo回首頁
        goToHomePage() {
            this.$router.push("/");
        },
        //搜尋
        searchStoreName() {
            console.log("search inputtext : ", this.inputValue);
            // 使用 $router.push 实现页面跳转，并传递参数
            this.$router.push({
                name: "storePage",
                query: { value: this.inputValue }
            });
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
        setInputValue() {
            console.log("傳入之資料: ", this.$route.query.value);
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
        async getPost() {
            try {
                const response = await axios.get(`http://${locohost}/posts/random-top-twenty`, {
                    withCredentials: true,
                });
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                this.postData = response.data.commVoList; // 更新組件的數據
                console.log('this.postData from DB:', this.postData);
                // this.description=postData.postInfo.description;
                // this.imgurl=postData.postInfo.filePath;
                // this.postId=postData.postInfo.postId;
                // this.likeNumber=postData.postInfo.postLikeNumber;
                // this.postTitle=postData.postInfo.postTitle;
                // this.storeId=postData.postInfo.storeId;
                // this.userId=postData.postInfo.userId;

                // 遍歷每個帖子，獲取前兩條評論
                for (const post of this.postData) {
                    post.comments = await this.getTopTwoComments(post.postInfo.postId);
                }

            } catch (error) {
                console.error('Error fetching Post data:', error);
            }
        },
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
        // 檢查是否已登入
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
                // console.log("loginUserPicture : ",this.loginUserPicture);
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
                Swal.fire({
                    icon: "error",
                    title: "請先登入",
                });
                // alert('請先登入');
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
        //=========================================================================================================================

        //處理點讚
        async clickLike(post) {
            //判斷是否登入
            if (!this.isLogIn) {
                Swal.fire({
                    icon: "error",
                    title: "請先登入",
                    // text: "Something went wrong!",
                    // footer: '<a href="#">Why do I have this issue?</a>'
                });
                // alert('請先登入');
                return;
            }
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
                const response = await axios.post(`http://${locohost}/posts/getPostLike?postId=${post.postInfo.postId}&addNumber=${output}`, {}, {
                    withCredentials: true,
                });
                const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                console.log('postData from DB:', DBdata);
                post.postInfo.postLikeNumber = response.data.postInfo.postLikeNumber;

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

    }
}

</script>

<template>
    <div class="post-container" style="user-select: none;">
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
                    <!-- 登入者圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img class="userBtn" :src="getImage(loginUserPicture)" alt="" @mouseenter="this.showFnList"
                        v-if="getImage(loginUserPicture) && this.isLogIn">
                    <!-- 預設未登入頭貼 -->
                    <img class="userBtn" src="../sally/explorer.png" alt="" @mouseenter="this.showFnList" v-else>
                    <!-- 登入者圖片下拉選單 -->
                    <div class="userFnList" :class="{ 'fnListVisible': isFnListVisible }" @mouseleave="this.showFnList">
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





        <!-- 貼文區域 -->
        <div class="instagram-post" v-for="(post, index) in items" :key="index">
            <!-- 發文者頭像及名子 -->
            <div class="header">
                <figure>
                    <!-- 發文者圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img :src="getImage(post.user.picture)" v-if="post.user!==null">
                    <!-- 預設發文者圖片 -->
                    <img src="../../main/resources/static/images/explorer.png" v-else>
                </figure>
                <!-- 讀取發文者名字 -->
                <span class="username" v-if="post.user && post.user.name != null">{{ post.user.name }}</span>
                <span class="username" v-else>UserName</span>
            </div>
                <!-- 貼文Title -->
                <p class="postTitle" v-if="post.postInfo.postTitle" >{{ post.postInfo.postTitle }}</p>
            <!-- 貼文內容 -->
            <div class="content">
                <figure>
                    <!-- 如果圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img :src="getImage(post.postInfo.picture)" v-if="post.postInfo.picture">
                    <!-- 如果base64為空,則檢查路徑 -->
                    <img :src="post.postInfo.filePath" v-if="post.postInfo.picture === null">
                    <!-- 預設貼文圖片 -->
                    <img src="../../main/resources/static/images/error 404.png"
                        v-if="post.postInfo.picture === null && post.postInfo.filePath === ''">
                </figure>
                <!-- <span class="username">username</span> -->
                <p>{{ post.postInfo.description }}</p>
            </div>
            <!-- Like按鈕 -->
            <div class="heart">
                <!-- Like -->
                <div style="width: 85%;">
                    <i v-if="!post.isLiked" class="fa-regular fa-heart fa-lg" style="color: #000000;" @click="clickLike(post)"></i>
                    <i v-if="post.isLiked" class="fa-solid fa-heart fa-lg" style="color: #ff0000;" @click="clickLike(post)"></i>
                    <span class="likes">{{ post.postInfo.postLikeNumber }}</span>
                </div>
                <!-- 貼文更新時間 -->
                <div>
                    <p>{{this.formatCommentUpTime(post.postInfo.postUpdateTime)}}更新</p>
                </div>
            </div>
            <!-- 預覽前兩筆留言 -->
            <div class="comment-preview">
                <div class="comment" v-for="(comment, cIndex) in post.comments" :key="cIndex">
                    <span class="userName">{{ comment.postComment.name }}</span>
                    <p>{{ comment.postComment.comment }}</p>
                </div>
                <!-- 顯示完整評論btn -->
                <button class="showCommentBtn" @click="showComment(post.postInfo.postId, post.postInfo.storeId)">查看更多評論</button>
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
                        <div style="display: flex;">
                            <!-- 留言 -->
                            <div style="width: 80%;">
                                <p>{{ comment.postComment.comment }}</p>
                            </div>
                            <!-- 留言時間 -->
                            <div style="width: 30%;">
                                <p>{{this.formatCommentUpTime(comment.postComment.postCommentUpTime)}}</p>
                            </div>
                        </div>
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
                        <button class="submit btn" @click="sendComment(this.postId, this.storeId)">送出</button>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.post-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: 10px;
    width: 99vw;

    //Header區域
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
                        max-height: 125px;
                        transition: max-height .3s ease-in;
                        display: flex;
                        justify-content: center;
                    }
                }

                ul {
                    padding: 0%;
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

    //貼文區域
    .instagram-post {
        width: 50%;
        padding: 2%;
        margin: 10px 0;
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
            height: 70%;
            z-index: 99;
            background-color: #ffffff;
            border-radius: 10px;
            position: fixed;
            top: 20%;
            // /* 距離頂部的距離，根據需要調整 */
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
                            margin: 1% 2%;
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
                        padding: 5px 10px;
                        font-size: 1em;
                        font-weight: bolder;
                        color: #EE7214;
                        background: none;
                        border: none;
                        // overflow: hidden;

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
            }
        }
    }
}
</style>
