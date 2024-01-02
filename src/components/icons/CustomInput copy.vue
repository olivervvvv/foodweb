<template>
  <label class="text-input-with-icon" style="display: flex;">
    <input
      type="search"
      class="form-control"
      @focus="hideIcon"
      @blur="showIcon"
      placeholder="搜尋店家或是地區"
      v-model="inputValue"
    />
    <div v-if="isShowIcon" class="icontext">
      <img
        src="../../../public/icon/4213417_explore_find_glass_magnifier_search_icon.png"
        alt="Icon"
        class="searchIcon"
        style="max-width: 20px; max-height: 20px;"
      />
    </div>
    <input type="button" value="搜尋" class="search-btn" @click="search()">
  </label>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isShowIcon: true,
      inputValue:"",
    };
  },
  methods: {
    hideIcon() {
      this.isShowIcon = false;
    },
    showIcon() {
      this.isShowIcon = true;
    },
    search(){
      console.log("search inputtext : ",this.inputValue);
      // 使用 $router.push 实现页面跳转，并传递参数
      this.$router.push({
        name: "storePage",
        query: { value: this.inputValue }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.search-btn{
  width: 80px;
  border-radius: 50px;
  margin-left: 0.5%;
  cursor: pointer;
}
.icontext {
  position: absolute;
  top: 30%;
  left: 2%;
  z-index: 1;
}

.text-input-with-icon {
  position: relative;
  width: 100%;
  height: 40%;
}
.text-input-with-icon ::placeholder{
  z-index: 2;
}

.form-control {
  width: 200%;
  height: 100%;
  text-indent: 30px; /* 初始文本縮進為0 */
  transition: text-indent 0.2s; /* 添加過渡效果 */
  border-radius: 5px;
  border: 2px solid;
}
.form-control:focus {
  text-indent: 0px; /* 設置文本縮進，控制佔位符文本向左偏移 */
}
.searchIcon {
  max-width: 20px;
  max-height: 20px;
  margin-top: 0;
}

.form-control:focus + .icontext .searchIcon {
  display: none; /* 在輸入框獲得焦點時隱藏圖標 */
}
/* 增加清除按鈕的大小 */

.form-control::-webkit-search-cancel-button {
-webkit-appearance: none;
appearance: none;
width: 20px; /* 自定義寬度 */
height: 20px; /* 自定義高度 */
background: url('../../../public/icon/cross.png') center/cover; /* 自定義圖標 */
border: none;
}
</style>
