const express = require("express");
const bodyParser = require("body-parser");
const { getimage, post, approval } = require("../controllers/service");
const router = express.Router();

router.get("/getimage/:token", getimage);
router.post("/post", post);
router.post("/approval/:token", approval)

module.exports = router;
