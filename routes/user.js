const express = require("express");
const router = express.Router();

const {signup, login } = require("../controller/Auth");
const {getProfile} = require("../controller/Users");
const { auth} = require('../middleware/auth');
const {Signout} = require("../controller/Signout");
const { createMealPlan, getAllMealPlan, deleteMealsByUserId} = require("../controller/MealPlan");

//routes mapping
//Profile page routes
router.get('/user', auth, getProfile);
router.post("/user/signup", signup);
router.post("/user/login", login);
router.post('/signout', Signout);

router.post('/meal-plan/create', auth, createMealPlan);
router.get('/meal-plan', auth, getAllMealPlan);
router.delete('/meal-plan/delete', auth, deleteMealsByUserId);

module.exports = router;