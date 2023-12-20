<!-- 登入後顯示此畫面 -->
<script>
import axios from 'axios';
export default {
    data() {
        return {
            postId:0,
            imgurl:"",
            likeNumber:0,
            description:"",
        }
    },
    mounted() {
        this.editQuestionnaire();
    },
    methods: {
        async editQuestionnaire() {
            var postId=4
            // 将postId转为整数
            const intPostId = parseInt(postId, 10);
            try {
                const response = await axios.get(`http://localhost:8081/posts/getPost?postId=${intPostId}`);
                const postData = response.data; // 这里假设后端返回的数据包含问卷的所有信息
                console.log('postData from DB:', postData);
                this.imgurl=postData.postInfo.filePath;
                this.likeNumber=postData.postInfo.postLikeNumber;
                this.description=postData.postInfo.description;
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        }

    }
}

</script>
<template>
<link href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" rel="stylesheet" />
<div class="post-container">


    <div class="instagram-post">
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/me2.png" style="height: auto;width: 100%;border-radius: 99px;">
            </figure> 
            <span class="username">username</span>
        </div>
        <div>
            <div>
                <figure>
                    <img :src="imgurl" style="height: 100%;width: 100%;">
                </figure> 
                <span class="username">username</span>
                <p>{{description}}</p>
            </div>
        </div>
        <div class="content">
            <div class="heart">
                <i class="far fa-heart fa-lg fas"></i>
            </div> <p class="likes">{{likeNumber}}like</p>
                <p class="caption">
                <span>留言者1</span> When you're too ready for summer '18 ☀️</p>
        </div>
    </div>

    <div class="instagram-post">
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/me2.png" style="height: auto;width: 100%;border-radius: 99px;">
            </figure> 
            <span class="username">username</span>
        </div>
        <div>
            <div>
                <figure>
                    <img :src="imgurl" style="height: 100%;width: 100%;">
                </figure> 
                <span class="username">username</span>
                <p>{{description}}</p>
            </div>
        </div>
        <div class="content">
            <div class="heart">
                <i class="far fa-heart fa-lg fas"></i>
            </div> <p class="likes">{{likeNumber}}like</p>
                <p class="caption">
                <span>留言者1</span> When you're too ready for summer '18 ☀️</p>
        </div>
    </div>

    <div class="instagram-post">
        <div class="header">
            <figure style="height:32px;width: 32px;margin-right: 2%;">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/me2.png" style="height: auto;width: 100%;border-radius: 99px;">
            </figure> 
            <span class="username">username</span>
        </div>
        <div>
            <div>
                <figure>
                    <img :src="imgurl" style="height: 100%;width: 100%;">
                </figure> 
                <span class="username">username</span>
                <p>{{description}}</p>
            </div>
        </div>
        <div class="content">
            <div class="heart">
                <i class="far fa-heart fa-lg fas"></i>
            </div> <p class="likes">{{likeNumber}}like</p>
                <p class="caption">
                <span>留言者1</span> When you're too ready for summer '18 ☀️</p>
        </div>
    </div>


</div>

</template>
<style>
body {
    color: #000000;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
}
body, button, input, select, textarea {
    font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
}
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
.fa-heart:before {
    content: "\f004";
}

:after, :before {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
}
.instagram-post
.far.fa-heart, .fas.fa-heart {
    cursor: pointer;
}
.fa, .far, .fas {
    font-family: Font Awesome\ 5 Free;
}
.far {
    font-weight: 400;
}
.fa-lg {
    font-size: 1.33333em;
    line-height: .75em;
    vertical-align: -0.0667em;
}
.fa, .fab, .fal, .far, .fas {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}
:after, :before {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
}
:after, :before {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
}
</style>
