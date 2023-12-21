import { defineStore } from 'pinia';


export default defineStore("piniaPractise",{
    state:()=>({
        
    }),
    getters:{

    },
    actions:{
        
        //把後端所有問卷包括小問題抓出來--------------------
        async searchAllQna(){
            var arr =[];
            const url = 'http://localhost:8081/api/quiz/search1';
            // 要帶入的值

            const queryParams = new URLSearchParams({
            title: "",
            startDate:"2000-01-01",
            endDate:"2099-01-01",
            });

            // 將查詢字串附加到 URL
            const urlWithParams = `${url}?${queryParams}`;

            await fetch(urlWithParams, {
            method: "GET", 
            headers: new Headers({
                "Accept":"application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"*"
            }),
            })
            .then(response => {
            // 將API回應轉換為JSON格式
            return response.json();
            })
            .then(data => {
            // 將API回應的JSON數據設置到組件的responseData數據屬性中
                this.allQuestionnaireA=data
                // console.log(this.allQuestionnaireA);
            })
        },
        // 後端抓取問卷   已出版的
        async searchAllQnIsPublished(){
                const url = 'http://localhost:8081/api/quiz/searchQuestionnaireList1';
                // 要帶入的值
    
                const queryParams = new URLSearchParams({
                title: "",
                startDate:"2000-01-01",
                endDate:"2099-01-01",
                isPublished:true
                });
    
                // 將查詢字串附加到 URL
                const urlWithParams = `${url}?${queryParams}`;
    
                await fetch(urlWithParams, {
                method: "GET", 
                headers: new Headers({
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*"
                }),
                })
                .then(response => {
                // 將API回應轉換為JSON格式
                return response.json();
                })
                .then(data => {
                // 將API回應的JSON數據設置到組件的responseData數據屬性中
                this.isPublishedQnArr = data;
                })
        },


        
        //前往後端抓作答人資料
        async searchUserDataP(){
            const w =this.gettellCircleWhichOne();

            const url = 'http://localhost:8081/api/quiz/searchUserPeople';
            // 要帶入的值
            const queryParams = new URLSearchParams({
                qnidid:w
            });

            // 將查詢字串附加到 URL
            const urlWithParams = `${url}?${queryParams}`;

            await fetch(urlWithParams, {
            method: "GET", 
            headers: new Headers({
                "Accept":"application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"*"
            }),
            })
            .then(response => {
            // 將API回應轉換為JSON格式
            return response.json();
            })
            .then(data => {
            // 將API回應的JSON數據設置到組件的responseData數據屬性中
            this.allUserDataPinia = data;

            })
        },


// ===========================================================================get and set===================================

        gettellCircleWhichOne(){
            return this.tellCircleWhichOne
        },
        settellCircleWhichOne(num){
            this.tellCircleWhichOne = num ;
        },


    }
})