import React, { useState, useEffect } from "react";
import axios from "axios";
import './MealPlan.css'
import HeroSection from "../components/HeroSection";
import MealCard from "../components/MealCard";

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState([]); // To store meals fetched from backend
  const [nutritionData, setNutritionData] = useState([]); // To store nutrition data from Nutritionix API
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const API_ID = import.meta.env.VITE_REACT_APP_API_ID;
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  // Fetch meal plan from backend
  const fetchMealPlan = async () => {
    try {
      const response = await axios.get("/api/v1/meal-plan");
      const meals = response.data.data;
      setMealPlan(meals);

      // After fetching meals, fetch nutrition data for each meal
      const nutritionPromises = meals.flatMap((meal) => {
        // Return an array of promises for breakfast, lunch, and dinner
        return [
          fetchNutritionData(meal.meals.breakfast),
          fetchNutritionData(meal.meals.lunch),
          fetchNutritionData(meal.meals.dinner)
        ];
      });

      const nutritionResults = await Promise.all(nutritionPromises);
      setNutritionData(nutritionResults);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

const fetchNutritionData = async (mealTitle) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "x-app-id": API_ID,
      "x-app-key": API_KEY,
    };

    // Use POST request to fetch nutrition data
    const response = await axios.post(
      API_URL,
      {
        query: mealTitle
      },
      { headers }
    );
    return response.data.foods[0]; // Assuming the first food item is the most relevant
  } catch (error) {
    console.error(`Error fetching nutrition data for ${mealTitle}:`, error);
    return null; // Return null if there's an error
  }
};
  useEffect(() => {
    fetchMealPlan();
  }, []);

  return (
    <>
      <HeroSection title="Meal Planner" showCreateMealButton={true} showDeleteMealPlanButton={true}/>
      <div className="meal-container">
      {loading ? (
        <p>Loading meals...</p>
      ) : (
        mealPlan.map((meal, index) => (
          <div className="meal d-flex" key={index}>
            <span className="text-muted">Day {meal.day}</span>
            
            <MealCard
              mealTitle="Breakfast"
              meal={meal.meals.breakfast}
              nutrition={nutritionData[index * 3]} // Access breakfast nutrition
            />
            <MealCard
              mealTitle="Lunch"
              meal={meal.meals.lunch}
              nutrition={nutritionData[index * 3 + 1]} // Access lunch nutrition
            />
            <MealCard
              mealTitle="Dinner"
              meal={meal.meals.dinner}
              nutrition={nutritionData[index * 3 + 2]}
            />
          </div>
        ))
      )}
      </div>
    </>
  );
}