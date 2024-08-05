const asyncHandler = require("express-async-handler"); //try catch (err)
const axios = require('axios');
const qs = require('qs');

const kakaoAuthURL = 'https://kauth.kakao.com/oauth/authorize';
const client_id = 'f6934ee3623debfafa11c08df9107e75';
const redirect_uri = 'http://localhost:3000/callback';

const getKakaoLogin = asyncHandler(async (req, res) => {
    const authURL = `${kakaoAuthURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    res.redirect(authURL);
});

const getTokenResponse = asyncHandler(async (req, res) => {
    const { code } = req.query;
    
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
        grant_type: 'authorization_code',
        client_id,
        redirect_uri,
        code
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    const { access_token } = tokenResponse.data;
    res.json({ access_token });


    // // 액세스 토큰으로 사용자 정보 요청
    // const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    //     headers: {
    //         Authorization: `Bearer ${access_token}`
    //     }
    // });

    // // 사용자 정보를 JSON 형식으로 응답
    // res.json(userResponse.data);
});

module.exports = {
    getKakaoLogin,
    getTokenResponse
};