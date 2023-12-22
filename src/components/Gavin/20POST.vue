<!-- 登入後顯示此畫面 -->
<script>
import axios from 'axios';
export default {
    data() {
        return {
            postData:{},
            commentData:{},
            postId:0,
            imgurl:"",
            likeNumber:0,
            description:"",
            postTitle:"",
            storeId:0,
            userId:0,
            showcomment:false,
            commentInput:"",
        }
    },
    components: {
    },
    mounted() {
        this.getPost();
    },
    methods: {
        async getPost() {
            try {
                const response = await axios.get(`http://localhost:8081/posts/random-top-twenty`);
                const DBdata = response.data; // 这里假设后端返回的数据包含问卷的所有信息
                console.log('postData from DB:', DBdata);
                this.postData = response.data.commVoList; // 更新组件的数据
                console.log('this.postData from DB:', this.postData);
                // this.description=postData.postInfo.description;
                // this.imgurl=postData.postInfo.filePath;
                // this.postId=postData.postInfo.postId;
                // this.likeNumber=postData.postInfo.postLikeNumber;
                // this.postTitle=postData.postInfo.postTitle;
                // this.storeId=postData.postInfo.storeId;
                // this.userId=postData.postInfo.userId;

                // 遍历每个帖子，获取前两条评论
                for (const post of this.postData) {
                post.comments = await this.getTopTwoComments(post.postInfo.postId);
                }

            } catch (error) {
                console.error('Error fetching Post data:', error);
            }
        },
        async getTopTwoComments(postId) {
            try {
                const response = await axios.get(`http://localhost:8081/posts/${postId}/comments`);
                const comments = response.data;
                return comments.slice(0, 2); // 返回前两条评论
            } catch (error) {
                console.error('Error fetching comments:', error);
                return [];
            }
        },
        async showComment(postId) {
            this.showcomment=true;
            this.postId=postId;
            try {
                // 使用反引号定义模板字符串
                const getComment = await axios.get(`http://localhost:8081/posts/${postId}/comments`);
                const Comment = getComment.data;
                console.log('Comment from DB:',Comment);
                this.commentData = getComment.data;
                console.log('this.commentData from DB:',this.commentData);
            } catch (error) {
                console.error('Error in the second request:', error);
            }
        },



        //處理點讚
        async clickLike(post) {
            //改變like樣式
            post.isLiked = !post.isLiked;
            // 假设你的 post 对象中有一个属性用于跟踪先前的颜色
            const previousColor = post.previousColor || '#000000';
            // 更新颜色属性
            post.previousColor = post.isLiked ? '#ff0000' : '#000000';
            // 如果从 #ff0000 变为 #000000，则输出 1；如果从 #000000 变为 #ff0000，则输出 -1
            const output =  (previousColor === '#000000' && post.previousColor === '#ff0000')? 1 :
                (previousColor === '#ff0000' && post.previousColor === '#000000') ? -1 : 0;
            console.log('output:',output);

            try {
                const response = await axios.post(`http://localhost:8081/posts/getPostLike?postId=${post.postInfo.postId}&addNumber=${output}`);
                const DBdata = response.data; // 这里假设后端返回的数据包含问卷的所有信息
                console.log('postData from DB:', DBdata);
                post.postInfo.postLikeNumber = response.data.postInfo.postLikeNumber;

            } catch (error) {
                console.error('Error fetching Like data:', error);
            }
        },
        //處理送出留言
        sendComment(postId){
            console.log('commentInput:', this.commentInput);




            this.showComment(postId);
        }
    }
}

</script>

<template>
<div class="post-container" style="user-select: none;">
    <div class="instagram-post" v-for="(post, index) in postData" :key="index">
        <!-- 發文者頭像及名子 -->
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/me2.png" style="height: auto;width: 100%;border-radius: 99px;">
            </figure> 
            <span class="username">username</span>
        </div>
        <!-- 貼文內容 -->
        <div>
            <div>
                <figure>
                    <img :src="post.postInfo.filePath" style="height: 100%;width: 100%;">
                </figure> 
                <span class="username">username</span>
                <p>{{post.postInfo.description}}</p>
            </div>
        </div>
        <!-- Like按鈕 -->
        <div class="content">
            <div class="heart">
                <i v-if="!post.isLiked" class="far fa-heart fa-lg" style="color: #000000;" @click="clickLike(post)"></i>
                <i v-if="post.isLiked" class="fas fa-heart fa-lg" style="color: #ff0000;" @click="clickLike(post)"></i>
                <span class="likes">{{post.postInfo.postLikeNumber}}like</span>
            </div> 
        </div>
        <!-- 預覽前兩筆留言 -->
        <div class="comment-preview">
            <div v-for="(comment, cIndex) in post.comments" :key="cIndex">
            <span style="font-weight: bold;">{{comment.name}}</span> <p>{{comment.comment}}</p>
            </div>
            <!-- 顯示完整評論btn -->
            <button class="blue-city-btn" @click="showComment(post.postInfo.postId)">顯示完整評論</button>
        </div>
    </div>

    <!-- 跳出完整評論頁面 -->
    <div v-if="showcomment" class="blur-background">
        <div class="comment-container">
            <!-- 顯示評論區域 -->
            <div class="comment-text-container">
                <div class="content" v-for="(comment, index) in commentData">
                    <span style="font-weight: bold;">{{comment.name}}</span> <p>{{comment.comment}}</p>
                </div>
            </div>
            <!-- 輸入區域 -->
            <div class="btn-container2">
                <textarea name="commentInput" rows="4" style="width: 80%;" v-model="commentInput"></textarea>
            </div>
            <!-- 按鈕區域 -->
            <div class="btn-container2">
                <button class="green-btn" @click="sendComment(this.postId)">送出</button>
                <button class="red-btn" @click="showcomment=false">取消</button>
            </div>
        </div>
    </div>



</div>

</template>
<style>
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
}
.instagram-post {
    width: 70%;
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
    top: 10%; /* 距离顶部的距离，根据需要调整 */
    overflow: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.559); /* 添加阴影 */
}
.blur-background {
    backdrop-filter: blur(5px); /* 调整像素值以增加或减少模糊效果 */
    background-color: rgba(255, 255, 255, 0.5); /* 调整颜色和透明度 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* 确保在其他元素之上 */
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
