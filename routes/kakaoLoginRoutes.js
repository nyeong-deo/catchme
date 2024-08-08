const express = require("express");
const router = express.Router();
//const {getKakaoLogin,getTokenResponse} = require("../controllers/kakaoLoginController")
const kakaoCallback = require('../controllers/kakaoLoginController');

router.post('/', kakaoCallback);
//router.route("/login/kakao").get(getKakaoLogin)
//router.route("/callback").get(getTokenResponse)

module.exports = router;