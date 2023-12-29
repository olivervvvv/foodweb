<!-- 顯示單一貼文 -->
<script>
import axios from 'axios';
export default {
    data() {
        return {
            postData:{},
            commentData:{},
            postId:0,
            storeId:0,
            imgurl:"",
            likeNumber:0,
            description:"",
            postTitle:"",
            storeId:0,
            userId:0,
            showcomment:false,
            commentInput:"",

            comments:"",
            InputValue:"",
            isLogIn:false,
            imgB64:"",
            userPicture:"",
            userCommentPicture:"",
            user:{},
            userName:"",
        }
    },
    components: {
    },
    mounted() {
        this.getPost();
        this.logInCheck();
        // //设置一个定时器每2秒执行一次,讀取最新留言
        // this.commentInterval = setInterval(() => {
        //     if (this.showcomment) {
        //         this.showComment(this.postId, this.storeId);
        //     }
        // }, 2000);


        
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
            console.log("傳入之資料: ",this.$route.query.value);
            try {
                    const response = await axios.get(`http://${locohost}/posts/getPost?postId=${this.$route.query.value}`);
                    const DBdata = response.data; // 這裡假設後端返回的數據包含問卷的所有信息
                    console.log('postData from DB:', DBdata);
                    this.postData = DBdata; // 更新組件的數據
                    console.log('this.postData from DB:', this.postData);
                    //設定貼文內容
                    this.description=this.postData.postInfo.description;
                    this.imgurl=this.postData.postInfo.filePath;
                    this.imgB64=this.postData.postInfo.picture;
                    this.postId=this.postData.postInfo.postId;
                    this.likeNumber=this.postData.postInfo.postLikeNumber;
                    this.postTitle=this.postData.postInfo.postTitle;
                    this.storeId=this.postData.postInfo.storeId;
                    this.userId=this.postData.postInfo.userId;
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
                const response = await axios.get(`http://${locohost}/posts/${postId}/comments`,{
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
                const response =await axios.get(`http://${locohost}/public/users/${userId}`, {
                withCredentials: true,
                });
                const userData = response.data;
                console.log('userData :',userData);

                //根據userId回傳user的名子
                this.user=userData;
                this.userName=userData.name;
                console.log('this.user:', this.userName);
                //根據userId回傳user的頭像
                return ("data:image/jpeg;base64," + userData.picture);
            } catch (error) {
                console.error('Error getUserPicture:', error);
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
        // 顯示完整留言
        async showComment(postId, storeId) {
            //判斷是否登入
            await this.logInCheck();
            console.log("logInCheck : ",this.isLogIn)
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
            const output =  (previousColor === '#000000' && post.previousColor === '#ff0000')? 1 :
                            (previousColor === '#ff0000' && post.previousColor === '#000000') ? -1 : 0;
            console.log('output:',output);
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
    },
}

</script>

<template>
<div class="post-container" style="user-select: none;">
    <div class="instagram-post">
        <!-- 發文者頭像及名子 -->
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <!-- 發文者圖片有效，顯示圖片；否則顯示默認圖片 -->
                <img :src="this.userPicture" style="height: auto;width: 100%;border-radius: 99px;" v-if="this.userPicture">
                <!-- 預設發文者圖片 -->
                <img src="../../main/resources/static/images/explorer.png" style="height: auto;width: 100%;border-radius: 99px;" v-else>
            </figure> 
            <!-- 讀取發文者名子 -->
            <span class="username" v-if="this.user && this.userName != null">{{this.userName}}</span>
            <span class="username" v-else>UserName</span>
        </div>
        <!-- 貼文內容 -->
        <div>
            <div>
                <figure>
                    <!-- 如果圖片有效，顯示圖片；否則顯示默認圖片 -->
                    <img :src="getImage(this.imgB64)" style="height: 100%; width: 100%;" v-if="imgB64">
                    <img :src="imgurl" style="height: 100%; width: 100%;" v-if="imgB64===null">
                    <!-- 預設貼文圖片 -->
                    <img src="../../main/resources/static/images/error 404.png" style="height: 100%; width: 100%;" v-if="imgB64===null&&imgurl===''">
                </figure> 
                <!-- <span class="username">username</span> -->
                <p>{{this.description}}</p>
            </div>
        </div>
        <!-- Like按鈕 -->
        <div class="content">
            <div class="heart">
                <i v-if="!this.postData.isLiked" class="fa-regular fa-heart fa-lg" style="color: #000000;" @click="clickLike(postData)"></i>
                <i v-if="this.postData.isLiked" class="fa-solid fa-heart fa-lg" style="color: #ff0000;" @click="clickLike(postData)"></i>
                <span class="likes">{{this.likeNumber}}like</span>
            </div> 
        </div>
        <!-- 預覽前兩筆留言 -->
        <div class="comment-preview">
            <div v-for="(comment, cIndex) in this.comments" :key="cIndex">
            <span style="font-weight: bold;">{{comment.postComment.name}}</span> <p>{{comment.postComment.comment}}</p>
            </div>
            <!-- 顯示完整評論btn -->
            <button class="blue-city-btn" @click="showComment(this.postId,this.storeId)">顯示完整評論</button>
        </div>
    </div>

    <!-- 跳出完整評論頁面 -->
    <div v-if="showcomment" class="blur-background">
        <div  class="comment-container">
            <!-- 顯示評論區域 -->
            <div ref="commentContainer" class="comment-text-container">
                <!-- 有評論顯示 -->
                <div class="content"  v-for="(comment, index) in commentData" v-if="commentData.length > 0"> 
                    <div style="display: flex;align-items: center">
                        <!-- 留言者頭像 -->
                        <figure style="height:32px;width: 32px;" >
                            <!-- 留言者圖片有效，顯示圖片；否則顯示默認圖片 -->
                            <img :src="getImage(comment.userPicture)" style="height: auto;width: 100%;border-radius: 99px;" v-if="getImage(comment.userPicture)">
                            <!-- 預設留言者圖片 -->
                            <img src="../../main/resources/static/images/explorer.png" style="height: auto;width: 100%;border-radius: 99px;" v-else>
                        </figure> 
                        <span style="font-weight: bold;margin: 2%;">{{comment.postComment.name}}</span> 
                    </div>
                    <p style="padding-left: 5%;">{{comment.postComment.comment}}</p>
                </div>
                <!-- 無評論顯示 -->
                <div  v-else class="no-content">
                    <span style="font-weight: bold;font-size: 40pt;">目前沒有評論</span>
                </div>
            </div>
            <!-- 輸入區域 -->
            <div class="btn-container2">
                <textarea name="commentInput" rows="4" style="width: 80%;" v-model="commentInput"></textarea>
            </div>
            <!-- 按鈕區域 -->
            <div class="btn-container2">
                <button class="green-btn" @click="sendComment(this.postId,this.storeId)">送出</button>
                <button class="red-btn" @click="showcomment=false">取消</button>
            </div>
        </div>
    </div>



</div>

</template>
<style lang="scss" scoped>
.header{
    display: flex;
    margin: 2%;
}
.post-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: 10px;
    width: 99vw;
}
.instagram-post {
    width: 40%;
    padding: 5px 0;
    background-color: white;
    margin: 5px;
    padding: 2%;
    border-radius: 5%;
}
i{
    cursor: pointer;
}
.blue-city-btn{
    width: 100px;
    padding: 10px;
    /* margin: 5px; */
    background-color: #0800ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.blue-city-btn:hover {
    background-color: #050093;
}
.comment-container{
    width: 70%;
    height: 60%;
    z-index: 99;
    background-color: #ffffff;
    border-radius: 20px;
    position: fixed;
    top: 10%; /* 距離頂部的距離，根據需要調整 */
    overflow: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.559); /* 添加陰影 */
}
.blur-background {
    backdrop-filter: blur(5px); /* 調整像素值以增加或減少模糊效果 */
    background-color: rgba(255, 255, 255, 0.5); /* 調整顏色和透明度 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* 確保在其他元素之上 */
    display: flex;
    align-items: center;
    justify-content: center;
}
.comment-text-container{
    width: 100%;
    height: 60%;
    padding: 5%;
    overflow: auto;
}
.no-content{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.green-btn{
    width: 100px;
    padding: 10px;
    margin: 5px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.green-btn:hover {
    background-color: #3b8a3e;
}
.red-btn{
    width: 100px;
    padding: 10px;
    margin: 5px;
    background-color: #ff0000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.red-btn:hover {
    background-color: #b40000;
}
.btn-container2{
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
