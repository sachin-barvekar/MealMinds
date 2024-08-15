import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash"; // To use debounce for API calls

const MealForm = () => {
  const [breakfastOptions, setBreakfastOptions] = useState([]);
  const [lunchOptions, setLunchOptions] = useState([]);
  const [dinnerOptions, setDinnerOptions] = useState([]);

  const [searchResults, setSearchResults] = useState([]); // For auto-populate search results

  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentDay, setCurrentDay] = useState(1); // Track the current day

  // API keys and URLs (replace with your own keys)
  const API_URL = "https://trackapi.nutritionix.com/v2/search/instant";
  const API_KEY = "c856625bb3a757b996c117ae6ab86639";
  const API_ID = "dfae88fc";

  // Fetch meal options based on the query
  const fetchMealOptions = async (query) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "x-app-id": API_ID,
          "x-app-key": API_KEY,
        },
        params: {
          query: query,
        },
      });
      return response.data.common;
    } catch (error) {
      console.error("Error fetching meal options:", error);
      return [];
    }
  };

  // Fetch breakfast, lunch, and dinner options on component mount (initial load)
  useEffect(() => {
    const fetchData = async () => {
      const breakfastData = await fetchMealOptions("eggs, pancakes, oatmeal");
      const lunchData = await fetchMealOptions("sandwich, salad, burger");
      const dinnerData = await fetchMealOptions("steak, pasta, chicken");

      setBreakfastOptions(breakfastData);
      setLunchOptions(lunchData);
      setDinnerOptions(dinnerData);
    };
    fetchData();
  }, []);

  // Debounced search to limit API calls
  const debouncedSearch = _.debounce(async (query) => {
    if (query.length > 2) { // Only search when query is at least 3 characters
      const results = await fetchMealOptions(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, 500);

  // Handle input change for search
  const handleSearchChange = (mealType, value) => {
    setSelectedMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: value,
    }));

    debouncedSearch(value); // Trigger debounced search
  };

  // Handle meal selection from search results
  const handleMealSelect = (mealType, mealName) => {
    setSelectedMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: mealName,
    }));
    setSearchResults([]); // Clear search results after selection
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected meals:", selectedMeals);
    setIsSubmitted(true);

    // Increment the day counter when the form is submitted
    setCurrentDay((prevDay) => prevDay + 1);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Select Your Meals</h1>
      <h3 className="text-center">Day {currentDay}</h3> {/* Display current day */}
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
              onChange={(e) => handleSearchChange("breakfast", e.target.value)}
              required
            />
            {searchResults.length > 0 && (
              <ul className="list-group">
                {searchResults.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("breakfast", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name} - {item.nf_calories} calories
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
              onChange={(e) => handleSearchChange("lunch", e.target.value)}
              required
            />
            {searchResults.length > 0 && (
              <ul className="list-group">
                {searchResults.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("lunch", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name} - {item.nf_calories} calories
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
              onChange={(e) => handleSearchChange("dinner", e.target.value)}
              required
            />
            {searchResults.length > 0 && (
              <ul className="list-group">
                {searchResults.map((item) => (
                  <li
                    key={item.food_name}
                    className="list-group-item"
                    onClick={() => handleMealSelect("dinner", item.food_name)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.food_name} - {item.nf_calories} calories
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2>Meals Submitted Successfully for Day {currentDay - 1}!</h2>
          <p><strong>Breakfast</strong>: {selectedMeals.breakfast}</p>
          <p><strong>Lunch</strong>: {selectedMeals.lunch}</p>
          <p><strong>Dinner</strong>: {selectedMeals.dinner}</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setIsSubmitted(false)} // Reset form for next day
          >
            Plan for Next Day
          </button>
        </div>
      )}
    </div>
  );
};

export default MealForm;
