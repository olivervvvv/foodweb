<script >
import{mapState,mapActions} from 'pinia'
import train from '../../stores/train'
export default {
    data() {
        return {
            city: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '台東', '花蓮', '宜蘭', '金馬',],
            page:0,
            //搜尋店名變數
            searchStoreName: [],



        };
    },
    computed:{
        ...mapState(train,["x"])
    },
    methods: {
        getButtonColor(index) {
            // 這裡可以使用一些邏輯來生成不同的顏色，例如基於索引或城市名稱的某種計算
            return `rgb(${index * 20}, ${index * 30}, ${index * 10})`;
        },

        searchAllIdTest() {
            fetch(`http://localhost:8081/api"/foodMap/searchName`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    this.name = data
                    console.log(this.name)


                })
                .catch(error => {
                    // console.error("error", error);
                })

        },

        ...mapActions(train,["getx","setx"])
    },
        //生命週期:進到頁面可以直接顯示內容
        mounted() {
                    this.setx([3,4])
                let w = this.getx()
                console.log(w)
        },
}

</script>

<template>
<button :click="searchAllIdTest"> 123</button>
    <div class="bgArea">
        <div class="topArea">
            <div class="memberArea">
            </div>
        </div>
        <div class="underArea" v-if="page==0">
            <div class="leftArea">
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
                        <div class="clickLikeArea">
                            <div class="like">
                                <button :style="{ border: '0px', opacity: 0.5 }">
                                    <i class="fa-regular fa-thumbs-up"></i></button>
                            </div>
                            <div class="dislike">
                                <button :style="{ border: '0px', opacity: 0.5 }">
                                    <i class="fa-regular fa-thumbs-down"></i></button>
                            </div>
                        </div>

                        <div class="message">

                        </div>

                    </div>
                </div>
            </div>

            <div class="rightArea">
                <div class="area" v-for="item in city"></div>
                <button v-for="index in city" :key="index" class="btn1">
                    {{ index }}
                </button>

            </div>

        </div>


    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    width: 100vw;
    height: 100vh;
    background-color: gainsboro;
}

.topArea {
    width: 100%;
    height: 20%;
    display: flex;

    .returnArea {
        width: 25vw;
        height: 20vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .searchArea {
        width: 50vw;
        height: 20vh;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .searchInput {
            height: 50px;
            width: 70vw;
            border-radius: 30px;
        }

        .fa-solid {
            height: 20px;
            width: 20px;
            font-size: 30px;

        }
    }

    .memberArea {
        width: 25vw;
        height: 20vh;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
}

.underArea {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-evenly;

    .rightArea {
        position: fixed;
        right: 1%;
        height: 50%;
        width: 16%;
        border: 1px solid black;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

    }

    .leftArea {
        height: 100%;
        width: 60%;
        margin-right: 500px;
        border: 1px solid black;

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

    }

    .underleftPicArea {
        width: 100%;
        height: 90%;
        border: 1px solid black;
        display: flex;
    }

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

        .clickLikeArea {
            width: 100%;
            height: 10%;
            background-color: rgb(200, 226, 222);
            display: flex;

            .like {
                width: 50%;
                height: 100%;
                background-color: rgb(220, 200, 226);

            }

            .dislike {
                width: 50%;
                height: 100%;
                background-color: rgb(200, 226, 203);
            }

        }

        .message {
            width: 100%;
            height: 40%;
            background-color: rgb(216, 208, 183);
        }
    }

}

.btn {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.btn1 {
    margin: 5px;
    width: 70px;
    height: 35px;
    font-size: 15pt;
    border: 0px;
    background-color: gainsboro;
    ;

    &:hover {
        background-color: rgb(122, 134, 125);
    }
}

.fa-regular {
    font-size: 30pt;
}</style>
