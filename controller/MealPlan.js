const MealPlanModel = require('../models/MealPlan');

exports.createMealPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { day, meals } = req.body;

        // Ensure all meal types are provided
        if (!meals || !meals.breakfast || !meals.lunch || !meals.dinner) {
            return res.status(400).json({ success: false, message: 'All meal types (breakfast, lunch, dinner) are required' });
        }

        // Check if a meal plan already exists for this user and day
        const existingMealPlan = await MealPlanModel.findOne({ day, user: userId });
        if (existingMealPlan) {
            return res.status(400).json({ success: false, message: 'A meal plan for this day already exists.' });
        }

        // Create and save new meal plan
        const newMealPlan = new MealPlanModel({
            day,
            meals: {
                breakfast: meals.breakfast,
                lunch: meals.lunch,
                dinner: meals.dinner
            },
            user: userId
        });

        await newMealPlan.save();
        res.status(201).json({ success: true, data: newMealPlan });
    } catch (error) {
        console.error('Error creating MealPlan:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllMealPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const mealPlans = await MealPlanModel.find({ user: userId });

        res.status(200).json({ success: true, data: mealPlans });
    } catch (error) {
        console.error('Error fetching MealPlans:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteMealsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const mealPlans = await MealPlanModel.find({ user:userId });
        if (mealPlans.length === 0) {
            return res.status(404).json({ success: false, message: 'No meal plans found for this user' });
        }
        // Delete all meal plans for the user
        await MealPlanModel.deleteMany({ user:userId });
        res.status(200).json({ success: true, message: 'All meal plans deleted successfully for the user' });
    } catch (error) {
        console.error('Error deleting meal plans for user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};