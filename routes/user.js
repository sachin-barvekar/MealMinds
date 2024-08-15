const express = require("express");
const router = express.Router();

const {signup, login } = require("../controller/Auth");
const {getProfile} = require("../controller/Users");
const { auth} = require('../middleware/auth');
const {Signout} = require("../controller/Signout");

//routes mapping
//Profile page routes
router.get('/user', auth, getProfile);
router.post("/user/signup", signup);
router.post("/user/login", login);

router.post('/signout', Signout);

module.exports = router;