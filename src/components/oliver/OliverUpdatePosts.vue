<template>
    <div>
      <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <label for="postId">Post ID:</label>
        <input v-model="formData.postId" type="text" id="postId" name="postId" required /><br />
  
        <label for="postTitle">Post Title:</label>
        <input v-model="formData.postTitle" type="text" id="postTitle" name="postTitle" required /><br />
  
        <label for="description">Description:</label>
        <input v-model="formData.description" type="text" id="description" name="description" required /><br />
  
        <label for="picture">Picture:</label>
        <input v-on:change="handleFileChange" type="file" id="picture" name="picture" accept="image/*" required /><br />
  
        <button type="submit">Update Post</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          postId: "",
          postTitle: "",
          description: "",
          picture: null,
        },
      };
    },
    methods: {
      handleFileChange(event) {
        this.formData.picture = event.target.files[0];
      },
      submitForm() {
        // 使用 FormData 封装表单数据
        var formData = new FormData();
        formData.append("postId", this.formData.postId);
        formData.append("postTitle", this.formData.postTitle);
        formData.append("description", this.formData.description);
        formData.append("picture", this.formData.picture);
  
        // 发送 POST 请求
        fetch("http://localhost:8081/posts/updatePosts", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // 处理后端返回的数据
            console.log(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
    },
  };
  </script>
  