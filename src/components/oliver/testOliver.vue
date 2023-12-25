<template>
    <div>
      <form @submit.prevent="submitForm">
        <input v-model="storeId" type="text" name="storeId" value="1">
        <input v-model="userId" type="text" name="userId" value="1">
        <textarea v-model="description" name="description">This is a new post</textarea>
        <input v-model="locationCity" type="text" name="locationCity" value="1" placeholder="輸入區域">
        <input type="file" @change="handleFileChange" accept="image/*">
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        storeId: 1,
        userId: 1,
        description: 'This is a new post',
        picture: null,
        locationCity:"",
      };
    },
    methods: {
      handleFileChange(event) {
        this.picture = event.target.files[0];
      },
      submitForm() {
        const formData = new FormData();
        formData.append('storeId', this.storeId);
        formData.append('userId', this.userId);
        formData.append('description', this.description);
        formData.append('locationCity',this.locationCity);
        formData.append('picture', this.picture);


        axios.post('http://localhost:8081/posts/create', formData,                    
        {
            withCredentials: true,
        })
          .then(response => {
            console.log(response.data);
            // 處理成功響應
          })
          .catch(error => {
            console.error(error);
            // 處理錯誤響應
          });
      },
    },
  };
  </script>
  