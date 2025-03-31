const express = require("express");
const bodyParser = require("body-parser");
const { getimage, post, approval } = require("../controllers/service");
const router = express.Router();

const app = express();
app.use(bodyParser.json());

//The end point as given in the problem statement

router.get("/api/getimage/:token", getimage);
router.post("/api/post", post);
router.post("/api/approval/:token", approval)

module.exports = router;
