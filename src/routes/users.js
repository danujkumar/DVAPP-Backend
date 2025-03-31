const express = require("express");
const bodyParser = require("body-parser");
const { getimage, post, approval } = require("../controllers/service");
//The end point as given in the problem statement

router.get("/getimage/:token", getimage);
router.post("/post", post);
router.post("/approval/:token", approval)

module.exports = router;
