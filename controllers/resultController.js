const asyncHandler = require("express-async-handler"); //try catch (err)
const Result = require("../models/resultModel");
const { spawn } = require('child_process');

// @desc 파이썬 결과 저장하고 응답으로 주기
// @route POST /results
// @access Public
const createResult = asyncHandler(async (req, res) => {
    //console.log(req.body);

    // Python 스크립트를 실행
    const pythonProcess = spawn('python3', ['./test.py']);

    // 파이썬 스크립트에서 출력되는 데이터를 받아옴
    pythonProcess.stdout.on('data', async (data) => {
        const result = data.toString().trim(); // 버퍼를 문자열로 변환하고 공백 제거
        console.log(`Python Output: ${result}`);
        const name = "ha"; // 필요에 따라 req.body 또는 다른 값을 사용

        try {
            // 데이터베이스에 결과를 저장
            await Result.create({ name, result });
            res.status(201).json({ message: "Result created successfully", result: { name, result } });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    });

    // 파이썬 스크립트에서 발생한 오류를 받아옴
    pythonProcess.stderr.on('data', (data) => {
        const error = data.toString().trim(); // 버퍼를 문자열로 변환하고 공백 제거
        console.error(`Python Error: ${error}`);
        res.status(500).json({ error: 'Python Script Error', details: error });
    });

    // 파이썬 스크립트가 종료되었을 때 실행되는 코드
    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        res.status(200)
    });
});


// @desc Get all results by name
// @route GET /results/all/:name
// 전체 결과 보기
const getAllResults = asyncHandler(async (req, res) => {
    
    const name = req.params.name;
    console.log(req.params.name);

    // name이 일치하는 모든 문서 검색
    const results = await Result.find({ name });
    res.status(200).json(results);
});

// @desc Get a result by name
// @route GET /results/:name
// 최근 결과 하나 보기
const getResult = asyncHandler(async (req, res) => {
    const result = await Result.findOne({ name: req.params.name });

    res.status(200).send(result);
});


module.exports = {
    createResult,
    getAllResults,
    getResult
};