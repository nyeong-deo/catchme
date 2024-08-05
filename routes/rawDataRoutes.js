const express = require("express");
const router = express.Router();
const {getAllRawDatas,createRawData} = require("../controllers/rawDataController")


router.route("/")
    .get(getAllRawDatas)
    .post(createRawData)

module.exports = router;