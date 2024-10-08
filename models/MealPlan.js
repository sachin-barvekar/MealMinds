const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  meals: {
    breakfast: {
      type: String,
      required: true
    },
    lunch: {
      type: String,
      required: true
    },
    dinner: {
      type: String,
      required: true
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

// Create a compound index to ensure (user, day) is unique
MealPlanSchema.index({ day:1, user:1 }, { unique: true });

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);
module.exports = MealPlan;
