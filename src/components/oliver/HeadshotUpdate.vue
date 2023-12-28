<!-- HeadshotUploader.vue -->
<template>
    <div>
        <input type="file" @change="handleFileChange" />
        <button @click="updateHeadshot">更新大頭照</button>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            userId: 1,
            picture: null,
        };
    },
    methods: {
        handleFileChange(event) {
            this.picture = event.target.files[0];
        },
        async updateHeadshot() {
            try {
                const formData = new FormData();
                formData.append('userId', this.userId);
                formData.append('picture', this.picture);

                // 使用 axios.post 發送 POST 請求
                const response = await axios.post('http://localhost:8081/users/updateHeadshot', formData, {
                    withCredentials: true, // 如果需要跨域携带 cookie
                    headers: {
                        'Content-Type': 'multipart/form-data', // 設定 Content-Type 為 multipart/form-data
                    },
                });

                console.log(response); // 檢查伺服器回傳的 response

                if (response.status === 200) {
                    console.log('Headshot updated successfully!');
                } else {
                    console.error('Error updating headshot:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    },
};
</script>
