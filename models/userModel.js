const mongoose = require('mongoose');

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // 카카오 ID 또는 다른 인증 제공자의 사용자 ID는 유일해야 함
    },
    userName: {
        type: String,
        required: true,
    },
    ageRange: {
        type: String,
        enum: ['10-20', '21-30', '31-40', '41-50', '51-60', '61+'], // 예제 연령대
        default: null, // 연령대 정보가 없을 수 있음
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: null, // 성별 정보가 없을 수 있음
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // 이메일이 없는 사용자도 있을 수 있음
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true, // 전화번호가 없는 사용자도 있을 수 있음
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
});

// 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
