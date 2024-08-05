const express = require("express");
const app = express();

const dbConnect = require("./config/dbConnect");
dbConnect();

const router = express.Router();

app.get("/",(req,res)=>{
    res.send("hello");
});

//파싱 미들웨어 사용
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 라우터 모듈 사용
app.use("/contacts",require("./routes/contactRoutes"))
app.use("/rawdatas",require("./routes/rawDataRoutes"))
app.use("/result",require("./routes/resultRoutes"))
app.use("/",require("./routes/kakaoLoginRoutes"))

app.listen(3000,() =>{
    console.log("서버 실행 중")
});