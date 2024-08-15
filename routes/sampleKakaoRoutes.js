const express = require("express");
const router = express.Router();
const {getKakaoLogin,getTokenResponse} = require("../controllers/sampleKakaoLoginController")

router.route("/login/kakao").get(getKakaoLogin)
router.route("/callback").get(getTokenResponse)

module.exports = router;