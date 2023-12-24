<script >
export default {
    data() {
        return {
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            page: 0,
            //搜尋店名變數
            searchStoreName: [],
            
            noInfo: false,



        };
    },
    computed: {
    },
    methods: {
        //按地區按鈕換頁並顯示找到的相對應資料
        clickArea(city) {
            this.page = 2
            this.searchAllStore(city)
            console.log(city)
            if (this.searchStoreName == null) {
                        this.showNoInfo();
                    }
        },
        //後端找到店家名稱並傳回前端
        searchAllStore(city) {
            const url = 'http://localhost:8081/foodMap/getlocation';
            // 要帶入的值
            const queryParams = new URLSearchParams({
                locationCity:city
            });

            // 將查詢字串附加到 URL
            const urlWithParams = `${url}?${queryParams}`;

            fetch(urlWithParams, {
                method: "GET",
                headers: new Headers({
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }),
            })
                .then(response => {
                    // 將API回應轉換為JSON格式
                    return response.json();
                })
                .then(data => {
                    // 將API回應的JSON數據設置到組件的responseData數據屬性中
                    console.log(data)
                    this.searchStoreName = data.storeInfoList
                    //this.searchStoreName = this.searchStoreName.locationCity
                    console.log(this.searchStoreName)
                    // if (this.searchStoreName == null) {
                    //     this.showNoInfo();
                    // }

                })

        },
        //該地區沒有資訊時調出查無此資料的彈框
        showNoInfo() {
            this.noInfo = true;
        },
        closeNoInfo() {
            this.noInfo = false;
            location.reload();
        },

    },
    //生命週期:進到頁面可以直接顯示內容
    mounted() {

    },
}

</script>

<template>
    <div class="bgArea">
        <div class="topArea">
            <div class="noInfo" v-if="this.noInfo" > 
                <button  class="btn2"  @click="closeNoInfo"><i class="fa-solid fa-circle-xmark"></i></button>
                <span>No information available for the selected city.</span>
            </div>
        </div>
        <div class="underArea">
            <div class="leftArea" v-if="this.page ==0">
                <div class="titleArea">
                    <div class="num">

                    </div>
                    <div class="name">

                    </div>
                </div>

                <div class="underleftPicArea">
                    <div class="leftPicArea">
                        <div class="pic">
                        </div>
                        <div class="date">
                        </div>
                    </div>

                    <div class="rightPicArea">
                        <div class="content">

                        </div>

                        <div class="message">

                        </div>

                    </div>
                </div>
            </div>

            <div class="Areatwo" v-if="this.page == 2 ">
                <div class="Areathree" v-for="allCityStore in searchStoreName" >
                    <div class="locationLeftArea">

                    </div>
                    <div class="locarionRightArea">
                        <div class="storeName">
                            {{ allCityStore.name }}
                        </div>
                        <div class="storeStyle">
                            {{ allCityStore.foodStyle}}
                        </div>
                        <div class="storeLocation">
                            {{ allCityStore.locationCity }}
                        </div>
                    </div>
                </div>
            </div>


            <div class="rightArea">
                <div class="area" v-for="cityString in city">
                    <button v-for="cityString in city" class="btn1" @click="clickArea(cityString)">
                        {{ cityString }}
                    </button>
                </div>
            </div>

        </div>


    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    width: 100vw;
    height: 100vh;
    background-color: gainsboro;

    .topArea {
        width: 100%;
        height: 20%;
        display: flex;
        .noInfo{
            height:200px ;
            width: 500px;
            display: flex;
            align-items: center;
            //justify-content: center;
            flex-direction: column;
            border: 1px solid black;
            border-radius: 30px;
            //margin-left: 30%;
            font-size: 14pt;
            font-weight: bold;
            .btn2 {
                    margin: 5px;
                    width: 45px;
                    height: 45px;
                    font-size: 20pt;
                    border: 0px;
                    background-color: gainsboro;
                    border-radius: 50%;
                    
                    &:hover {
                        background-color: rgb(122, 134, 125);
                        
                    }
                    &:active{
                        background-color: rgb(249, 216, 105);
                    }
                }
        }
    }

    .underArea {
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: space-evenly;

        //定錨 最右邊畫面
        .rightArea {
            height: 50%;
            width: 16%;
            border: 3px solid rgb(245, 177, 59);
            display: flex;
            position: fixed;
            right: 1%;
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

        //原始畫面
        .leftArea {
            height: 100%;
            width: 60%;
            margin-right: 500px;
            border: 2px solid black;

            .titleArea {
                width: 100%;
                height: 10%;
                border: 1px solid black;
                display: flex;
                justify-content: space-evenly;

                .num {
                    width: 10%;
                    height: 100%;
                    border: 1px solid black;
                }

                .name {
                    width: 80%;
                    height: 100%;
                    border: 1px solid black;
                }
            }



            .underleftPicArea {
                width: 100%;
                height: 90%;
                border: 1px solid black;
                display: flex;


                .leftPicArea {
                    width: 50%;
                    height: 100%;
                    background-color: rgb(250, 184, 184);
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .pic {
                        width: 80%;
                        height: 90%;
                        border: 1px solid black;
                    }

                    .date {
                        width: 80%;
                        height: 10%;
                        border: 1px solid black;
                    }

                }





                .rightPicArea {
                    width: 50%;
                    height: 100%;
                    background-color: rgb(245, 244, 191);


                    .content {
                        width: 100%;
                        height: 50%;
                        background-color: rgb(226, 226, 200);
                    }



                    .message {
                        width: 100%;
                        height: 40%;
                        background-color: rgb(216, 208, 183);
                    }
                }
            }

        }
        

    }
//改變畫面
        .Areatwo {
            width: 80%;
            height: 100%;
            margin-right: 500pt;
            // background-color: rgb(252, 250, 250);
            
            .Areathree {
                width: 100%;
                height: 30%;
                display: flex;
                margin-bottom: 10px;
                .locationLeftArea {
                    width: 30%;
                    height: 100%;
                    background-color: rgb(230, 143, 143);
                }

                .locarionRightArea {
                    width: 70%;
                    height: 100%;
                    background-color: rgb(230, 211, 143);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    font-size: 14pt;
                    font-weight: bold;
                    .storeName {
                        width: 100%;
                        height: 30%;
                        background-color: rgb(161, 245, 217);
                        border-radius: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .storeStyle {
                        width: 100%;
                        height: 30%;
                        background-color: rgb(205, 156, 252);
                        border-radius: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .storeLocation {
                        width: 100%;
                        height: 30%;
                        background-color: cadetblue;
                        border-radius: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }




        }



}
</style>
