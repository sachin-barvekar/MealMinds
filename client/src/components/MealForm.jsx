import React, { useState } from "react";
import axios from "axios";
import _ from "lodash";
import HeroSection from "./HeroSection";

const MealForm = () => {
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const [searchResults, setSearchResults] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  }); // Separate search results for each meal type

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  const API_URL = import.meta.env.VITE_REACT_APP_API_LINK;
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const API_ID = import.meta.env.VITE_REACT_APP_API_ID;

  // Debounced search to limit API call
  const debouncedSearch = _.debounce(async (mealType, query) => {
    if (query.length > 2) { // Only search when query is at least 3 characters
      try {
        const response = await axios.get(API_URL, {
          headers: {
            "x-app-id": API_ID,
            "x-app-key": API_KEY,
          },
          params: { query: query },
        });
        setSearchResults((prevResults) => ({
          ...prevResults,
          [mealType]: response.data.common, // Set the search results for the specific meal type
        }));
      } catch (error) {
        console.error("Error fetching meal options:", error);
      }
    } else {
      setSearchResults((prevResults) => ({
        ...prevResults,
        [mealType]: [],
      }));
    }
  }, 500);

  // Handle input change for each meal type (breakfast, lunch, dinner)
  const handleInputChange = (mealType, value) => {
    setSelectedMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: value,
    }));

    // Trigger debounced search when user types
    debouncedSearch(mealType, value);
  };

  // Handle meal selection from search results
  const handleMealSelect = (mealType, mealName) => {
    setSelectedMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: mealName,
    }));
    setSearchResults((prevResults) => ({
      ...prevResults,
      [mealType]: [], // Clear search results after selection
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare meal data with only meal title, day, and meal type
    const mealData = {
      day: currentDay,
      meals: {
        breakfast: selectedMeals.breakfast,
        lunch: selectedMeals.lunch,
        dinner: selectedMeals.dinner,
      },
    };

    // Send the meal data to your backend for saving
    try {
      const res = await axios.post("/api/v1/meal-plan/create", mealData);
      setIsSubmitted(true);
      setCurrentDay((prevDay) => prevDay + 1); // Increment day
    } catch (error) {
      console.error("Error saving meal plan:", error);
    }
  };

  return (
    <>
    <HeroSection title="Create Meal Plan"/>
    <div className="container my-5">
      <h3 className="text-center text-muted">Day {currentDay}</h3> {/* Display current day */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          {/* Breakfast Section */}
          <div className="mb-3">
            <label className="form-label">Breakfast</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search breakfast meal..."
              value={selectedMeals.breakfast}
              onChange={(e) => handleInputChange("breakfast", e.target.value)}
              required
            />
            {searchResults.breakfast.length > 0 && (
              <ul className="list-group">
                {searchResults.breakfast.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("breakfast", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lunch Section */}
          <div className="mb-3">
            <label className="form-label">Lunch</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search lunch meal..."
              value={selectedMeals.lunch}
              onChange={(e) => handleInputChange("lunch", e.target.value)}
              required
            />
            {searchResults.lunch.length > 0 && (
              <ul className="list-group">
                {searchResults.lunch.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("lunch", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dinner Section */}
          <div className="mb-3">
            <label className="form-label">Dinner</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search dinner meal..."
              value={selectedMeals.dinner}
              onChange={(e) => handleInputChange("dinner", e.target.value)}
              required
            />
            {searchResults.dinner.length > 0 && (
              <ul className="list-group">
                {searchResults.dinner.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("dinner", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Submit
          </button>
          <p  className="mt-2  text-danger">
          Note: To add a new meal plan, please delete the existing ones.
        </p>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-muted">Meals Submitted Successfully for Day {currentDay - 1}!</h2>
          <p className="text-muted"><strong>Breakfast</strong>: {selectedMeals.breakfast}</p>
          <p className="text-muted"><strong>Lunch</strong>: {selectedMeals.lunch}</p>
          <p className="text-muted"><strong>Dinner</strong>: {selectedMeals.dinner}</p>
          <button
            className="btn btn-success mt-3"
            onClick={() => setIsSubmitted(false)} // Reset form for next day
          >
            Plan for Next Day
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default MealForm;