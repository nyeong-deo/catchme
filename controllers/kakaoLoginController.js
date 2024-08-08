const asyncHandler = require("express-async-handler"); //try catch (err)
const axios = require('axios');
//const qs = require('qs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const SECRET_KEY = process.env.SECRET_KEY;

const kakaoCallback = async (req, res) => {
    const { code } = req.body.params;
  
    try {
      // 액세스 토큰 요청
      const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
          redirect_uri: 'http://192.168.200.101:3000/callback', // 웹뷰의 redirect URI와 동일해야 함
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const accessToken = tokenResponse.data.access_token;
  
      // 사용자 정보 요청
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userId = userResponse.data.id;

      // 사용자 정보를 기반으로 JWT 생성
      const token = jwt.sign({ userId, userNickname, userEmail }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
  
      // 클라이언트에 사용자 ID 전송
      // res.json({ userId: userId });
      // console.log({ userId: userId });
    } catch (error) {
      console.error('Error during Kakao authentication:', error);
      res.status(500).send('Authentication failed');
    }
};

module.exports = {
    kakaoCallback
};




//const kakaoAuthURL = 'https://kauth.kakao.com/oauth/authorize';
//const client_id = 'f6934ee3623debfafa11c08df9107e75';
//const client_id ='c734d7df28d0aabfafcb2e622d57e6c5';
// const redirect_uri = 'http://192.168.0.14:3000/callback';
//const redirect_uri = 'http://192.168.0.2:3000/oauth/kakao/callback';

// const getKakaoLogin = asyncHandler(async (req, res) => {
//     const authURL = `${kakaoAuthURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
//     res.redirect(authURL);
// });

// const getTokenResponse = asyncHandler(async (req, res) => {
//     const { code } = req.query;
    
//     const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
//         grant_type: 'authorization_code',
//         client_id: client_id,
//         redirect_uri: redirect_uri,
//         code:code
//     }), {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });
    
//     const { access_token } = tokenResponse.data;
//     //res.json({ access_token });

//     try{
//         // 액세스 토큰으로 사용자 정보 요청
//         const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers: {
//                 Authorization: `Bearer ${access_token}`
//             },
//         });

//         const userId = userResponse.data.id;
    
//         console.log({ userId: userId });
//         res.json({userId});
//     }catch(err){
//         if (err.response) {
//             console.error('Error Response Data:', err.response.data);
//             console.error('Error Response Status:', err.response.status);
//         } else {
//             console.error('Error Message:', err.message);
//         }
//     }
// });

// module.exports = {
//     //getKakaoLogin,
//     getTokenResponse
// };