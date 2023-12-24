<script >
export default {
    data() {
        return {
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            locationCity:"",
        };
    },
    computed: {
    },
    methods: {
        //按地區按鈕換頁並顯示找到的相對應資料
        clickArea(city) {
            console.log(city);
            this.locationCity=city;
        },
    },
    mounted() {

    },
}

</script>

<template>
    <div class="rightArea">
        <div class="area" v-for="cityString in city">
            <button v-for="cityString in city" class="btn1" @click="clickArea(cityString)">
                {{ cityString }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>



.rightArea {
    height: 50%;
    width: 16%;
    border: 3px solid rgb(245, 177, 59);
    display: flex;
    position: fixed;
    right: 1%;
    top: 25%;
    border-radius: 30px;
    .area {
        position: fixed;
        right: 1%;
        height: 50%;
        width: 16%;
        border: 0px solid;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .btn1 {
            margin: 5px;
            width: 70px;
            height: 35px;
            font-size: 15pt;
            border: 0px;
            background-color: gainsboro;
            border-radius: 30px;

            &:hover {
                background-color: rgb(122, 134, 125);
                
            }
            &:active{
                background-color: rgb(249, 216, 105);
            }
        }
    }
}




</style>
