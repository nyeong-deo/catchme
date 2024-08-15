const express = require("express");
const session = require('express-session'); // express-session 모듈 가져오기
const app = express();

const dbConnect = require("./config/dbConnect");
dbConnect();

const router = express.Router();

const cors = require('cors');
const bodyParser = require('body-parser');

// 세션 미들웨어
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//파싱 미들웨어 사용
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//
app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 데이터 파싱


//첫 화면에 로그인 여부 확인 기능
app.get("/",(req,res)=>{
    console.log('Session data:', req.session);

    if (req.session.userId) {
        res.send(`Logged in as ${req.session.userName}`);
    } else {
        res.send('You are not logged in');
    }
});

// 라우터 모듈 사용
app.use("/contacts",require("./routes/contactRoutes"))
app.use("/rawdatas",require("./routes/rawDataRoutes"))
app.use("/result",require("./routes/resultRoutes"))
//app.use("/callback",require("./routes/kakaoLoginRoutes"))
app.use("/",require("./routes/sampleKakaoRoutes"))

app.listen(3000,() =>{
    console.log("서버 실행 중")
});