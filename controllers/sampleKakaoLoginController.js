const asyncHandler = require("express-async-handler"); //try catch (err)
const axios = require('axios');
const qs = require('qs');
const User = require("../models/userModel");

const kakaoAuthURL = 'https://kauth.kakao.com/oauth/authorize';
const client_id = process.env.CLIENT_ID
const redirect_uri = 'http://localhost:3000/callback';


const getKakaoLogin = asyncHandler(async (req, res) => {
    const authURL = `${kakaoAuthURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    console.log(authURL);
    res.redirect(authURL);
});

const getTokenResponse = asyncHandler(async (req, res) => {
    const { code } = req.query;
    
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
        grant_type: 'authorization_code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        code:code
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    const { access_token } = tokenResponse.data;
    //res.json({ access_token });

    try{
        // 액세스 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        let data = userResponse.data;
        let kakaoId = data.id;
        let name = data.properties.nickname;
        let ageRange = data.kakao_account.age_range; // 연령대 정보
        let gender = data.kakao_account.gender; // 성별 정보

        // 연령대 정보 제공 동의가 필요한 경우
        if (!ageRange && data.kakao_account.age_range_needs_agreement) {
            console.log("Age range info needs agreement. Requesting additional consent.");
        }

        // 성별 정보 제공 동의가 필요한 경우
        if (!gender && data.kakao_account.gender_needs_agreement) {
            console.log("Gender info needs agreement. Requesting additional consent.");
        }

        // 연령대 또는 성별 정보 제공에 동의하지 않은 경우 추가 동의 요청
        if (!ageRange || !gender) {
            const requiredScopes = [];
            if (!ageRange) requiredScopes.push('age_range');
            if (!gender) requiredScopes.push('gender');
            
            const consentURL = `${kakaoAuthURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${requiredScopes.join(',')}`;
            return res.redirect(consentURL);
        }

        //res.json({ data, kakaoId, name, ageRange, gender });


        // 사용자 정보를 데이터베이스에 저장하거나 가져오기
        //const user = await User.findOrCreate(kakaoId, name, ageRange, gender);

        // 세션에 사용자 정보 저장
        req.session.userId = kakaoId;
        req.session.userName = name;
        req.session.ageRange = ageRange;
        req.session.gender = gender;

        res.redirect('/');
       
    }catch(error){
        console.error('Error during Kakao login:', error.response ? error.response.data : error.message);
        res.status(500).send('Kakao login failed');
    }
});

module.exports = {
    getKakaoLogin,
    getTokenResponse
};