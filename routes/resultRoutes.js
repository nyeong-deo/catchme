const express = require("express");
const router = express.Router();
const {getAllResults,getResult} = require("../controllers/resultController")

router.route("/all/:name").get(getAllResults)
router.route("/:name").get(getResult)

module.exports = router;