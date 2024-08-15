const express = require("express");
const router = express.Router();
const {createResult,getAllResults,getResult} = require("../controllers/resultController")

router.route("").post(createResult)
router.route("/all/:name").get(getAllResults)
router.route("/:name").get(getResult)

module.exports = router;