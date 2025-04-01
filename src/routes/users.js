const express = require("express");
const bodyParser = require("body-parser");
const { getimage, post, approval } = require("../controllers/service");
const router = express.Router();

router.get("/api/getimage/:token", getimage);
router.post("/api/post", post);
router.post("/api/approval/:token", approval)

module.exports = router;
