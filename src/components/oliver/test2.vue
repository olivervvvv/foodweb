<template>
  <div>
    <h1>My Saved Content</h1>
    <ul v-if="savedContent">
      <li>
        {{ savedContent.description }}
        <img
          :src="getImageUrl(savedContent.picture)"
          alt="Saved Image"
          id="postPhoto"
        />
      </li>
    </ul>
    <div v-else>No saved content available.</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      savedContent: null, // 在這裡儲存從後端檢索到的內容
    };
  },
  methods: {
    getImageUrl(picture) {
      // 如果 picture 為 undefined，返回一個空字符串
      if (!picture) {
        return "";
      }

      // 直接返回 Base64 Data URL
      return "data:image/jpeg;base64," + picture;
    },

    async getPostFromBackend() {
      try {
        const response = await axios.get(
          "http://localhost:8081/posts/getPhoto?postId=1"
        );
        console.log(response.data.postInfo);
        this.savedContent = response.data.postInfo; // 設置資料到 savedContent 中
      } catch (error) {
        console.error("Error getting data from backend:", error);
        if (error.response) {
          console.error("Detailed error response:", error.response.data);
        }
      }
    },
  },
  created() {
    this.getPostFromBackend();
  },
};
</script>

<style>
    #postPhoto{
        width: 30vw;
        height: 30vh;
    }
</style>
