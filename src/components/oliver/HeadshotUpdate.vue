<!-- HeadshotUploader.vue -->
<template>
    <div>
        <input type="file" @change="handleFileChange" />
        <button @click="updateHeadshot">更新大頭照</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            userId: 1, // 這裡應該根據你的需求設定使用者ID
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

                const response = await fetch('http://localhost:8081/users/updateHeadshot', {
                    withCredentials: true,
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
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
  