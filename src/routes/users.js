const express = require("express");
const bodyParser = require("body-parser");
const { getimage, post, approval, getAllUsers } = require("../controllers/service");
const router = express.Router();

router.get("/api/getimage/:token", getimage);
router.post("/api/post", post);
router.post("/api/approval/:token", approval)
router.get("/all-users", getAllUsers)

module.exports = router;
