<!-- 登入後顯示此畫面 -->
<script>
import axios from 'axios';
export default {
    data() {
        return {
            postData:{},
            postId:0,
            imgurl:"",
            likeNumber:0,
            description:"",
            postTitle:"",
            storeId:0,
            userId:0,
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
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        },
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
                console.error('Error fetching quiz data:', error);
            }
        }
    }
}

</script>

<template>
<div class="post-container">


    <div class="instagram-post" v-for="(post, index) in postData" :key="index">
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/me2.png" style="height: auto;width: 100%;border-radius: 99px;">
            </figure> 
            <span class="username">username</span>
        </div>
        <div>
            <div>
                <figure>
                    <img :src="post.postInfo.filePath" style="height: 100%;width: 100%;">
                </figure> 
                <span class="username">username</span>
                <p>{{post.postInfo.description}}</p>
            </div>
        </div>
        <div class="content">
            <div class="heart" @click="clickLike(post)">
                <i v-if="!post.isLiked" class="far fa-heart fa-lg" style="color: #000000;"></i>
                <i v-if="post.isLiked" class="fas fa-heart fa-lg" style="color: #ff0000;"></i>
            </div> <p class="likes">{{post.postInfo.postLikeNumber}}like</p>
                <p class="caption">
                <span>留言者1</span> When you're too ready for summer '18 ☀️</p>
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
</style>
