<template>
    <button class="floating-button" @click="handleButtonClick">登入</button>
    <div class="menu-list" :class="{ 'menu-visible': isMenuVisible }">
        <ul>
            <li>收藏店家</li>
            <li>個人資料</li>
            <li>登出</li>
        </ul>
    </div>
    <sign></sign>
</template>
  
<script>
// import sign from '../logi.vue';
export default {
    data() {
        return {
            isMenuVisible: false
        }
    },
    methods: {
        handleButtonClick() {
            this.isMenuVisible = !this.isMenuVisible;
            this.$router.push({ name: 'logi' });
        }
    }
};
</script>
  
<style scoped>
.floating-button {
    position: fixed;
    bottom: 20px;
    /* 距離底部的距離 */
    left: 20px;
    /* 距離右側的距離 */
    background-color: #f0eb8b;
    /* 按鈕背景顏色 */
    color: #000000;
    /* 按鈕文本顏色 */
    border: none;
    border-radius: 50%;
    /* 將按鈕變成圓形 */
    width: 50px;
    /* 圓形按鈕的寬度 */
    height: 50px;
    /* 圓形按鈕的高度 */
    padding: 0;
    cursor: pointer;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    /* 添加陰影效果 */
    z-index: 2;

    &:hover {
        background-color: rgba(0, 0, 0, 0.3);
    }
}

.menu-list {
    /* display: none; */
    overflow: hidden;
    max-height: 0;
    position: fixed;
    bottom: 70px;
    left: 30px;
    transition: max-height 0.5s ease-in;
    z-index: 2;
    background-color: rgba(224, 225, 225, 0.5);
    width: 80px;
    display: flex;
    justify-content: center;

    &.menu-visible {
        max-height: 100px;
        transition: max-height .5s ease-in;
        display: block;
        display: flex;
        justify-content: center;
    }
}

ul {
    padding: 0;
    list-style-type: none;
}

li {
    padding-bottom: 2px;
}</style>