<template>
  <div class="totalArea">

    <div class="topArea">
        <h1 style="width: 200px; font-size: 50px; margin-left: auto; margin-right: auto;">店家名稱</h1>
    </div>

    <div class="leftArea">
        <input type="text" placeholder="貼文標題" style="margin-top: 20px; width: 600px; height: 50px; font-size: 35px; border-radius: 10px;">
        <br><br>
        <input type="text" placeholder="貼文內容" style="margin-top: 20px; width: 500px; height: 200px; font-size: 35px; border-radius: 10px;">
    </div>

    <div class="rightArea">
        <h1>圖片</h1>
        <br>
        <div class="imageArea">
            <img src="" alt="123">
        </div>
    </div>
    
    <div class="buttomArea">
        <button type="button" style="border-radius: 15px; width: 150px; height: 50px; font-size: 25px;">建立貼文</button>
    </div>

  </div>
</template>

<script>
export default {
    data(){
        return{

        }
    }

}
</script>

<style>
.totalArea{
    width: 100vw;
    height: 90vh;
    display: flex;
    flex-wrap: wrap ;
}
.topArea{
    width: 100%;
    height: 10%;
    margin-left: auto;
    margin-right: auto;
}
.leftArea{
    width: 50%;
    height: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
}
.rightArea{
    width: 50%;
    height: 90%;
    margin-top: 50px;
    display: flex;
    justify-content: center;

}
.imageArea{
    display: flex;
    justify-content: center;
}
.buttomArea{
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
}

</style>