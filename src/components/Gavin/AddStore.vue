<!-- 登入後顯示此畫面 -->
<script>
import { faListDots } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
export default {
    data() {
        return {
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            showCityList:false,
            locationCity:"",
            address:"",
            name:"",
            foodStyle:""
        }
    },
    components: {
    },
    mounted() {
    },
    methods: {
        selectCity(cityName) {
            this.locationCity = cityName;
            this.showCityList=false;
        },
        async addStore() {

            // 检查必填字段
            if (!this.name || !this.address || !this.locationCity||this.foodStyle) {
                // 使用 alert 显示提示框
                alert('請填寫所有資料');
                return;
            }
            const formData ={
                storeInfo: {
                name:this.name,
                address:this.address,
                locationCity:this.locationCity,
                foodStyle:this.foodStyle
                }
            }
            console.log('formData: ', formData);
            // console.log('this.name:', this.name);
            // console.log('this.address',this.address);
            // console.log('this.locationCity:', this.locationCity);
            try {
                const response = await axios.post('http://localhost:8081/foodMap/create',formData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
}

</script>

<template>
<div class="main-container">

    <div class="input-container">
        <label for="storeName">商店名稱</label>
        <input type="text" name="" id="storeName" v-model="name">
        <label for="storeAddress">商店地址</label>
        <input type="text" name="" id="storeAddress" v-model="address">
        <label for="foodStyle">商店類型</label>
        <input type="text" name="" id="foodStyle" v-model="foodStyle">
        <label for="locaCity">所在城市</label>
        <input type="text" name="" id="locaCity" v-model="locationCity" disabled>
        <button class="city-btn" @click="showCityList = true">選擇所在城市</button>
    </div>

    <div class="input-container" style="margin-top: 2%;">
        <button class="blue-city-btn" @click="addStore()">新增商店</button>
    </div>


    <div class="btn-container" v-if="showCityList">
        <div class="btn-div">
            <button class="city-btn" v-for="(cityName, index) in city" :key="index" @click="selectCity(cityName)">{{ cityName }}</button>
            <div class="btn-container2">
                <button class="red-city-btn" @click="showCityList=false">取消</button>
            </div>
        </div>

    </div>



</div>
</template>
<style>
.main-container{
    width: 100vw;
    height: 100vh;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.input-container{
    width: 85%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
.btn-container{
    width: 70%;
    height: 25%;
    z-index: 99;
    position: absolute;
    background-color: #ffffff;
    border-radius: 20px;
    
}
.btn-container2{
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn-div{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.city-btn{
    width: 100px;
    padding: 10px;
    margin: 5px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.city-btn:hover {
    background-color: #3b8a3e;
}
.red-city-btn{
    width: 100px;
    padding: 10px;
    margin: 5px;
    background-color: #ff0000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.red-city-btn:hover {
    background-color: #b40000;
}
.blue-city-btn{
    width: 100px;
    padding: 10px;
    margin: 5px;
    background-color: #0800ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.blue-city-btn:hover {
    background-color: #050093;
}
</style>
