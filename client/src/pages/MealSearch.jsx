import React, { useState } from 'react';
import axios from 'axios';
import './MealSearch.css';
import HeroSection from '../components/HeroSection'; // Adjust the path as necessary

export default function MealSearch() {
    const [nutritionData, setNutritionData] = useState(null);
    const [burnInfo, setBurnInfo] = useState(null);
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [servingSize, setServingSize] = useState(1); // Default serving size

    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    const fetchNutritionData = () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-app-id': 'dfae88fc',
            'x-app-key': 'c856625bb3a757b996c117ae6ab86639'
        };

        axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
            query: searchValue || "apple" // Use searchValue or default to "apple"
        }, { headers: headers })
            .then(response => {
                const foodData = response.data.foods[0];
                setNutritionData(response.data);
                updateBurnInfo(foodData, servingSize); // Update burn info based on serving size
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setNutritionData(null);
                setBurnInfo(null); // Reset burn info in case of error
            });
    };

    const updateBurnInfo = (foodData, servingSize) => {
        const calories = foodData.nf_calories * (servingSize / foodData.serving_qty);
        setBurnInfo({
            walking: (calories / 5).toFixed(2),
            running: (calories / 10).toFixed(2),
            bicycling: (calories / 8).toFixed(2)
        });
    };

    const handleServingSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setServingSize(newSize);
        if (nutritionData) {
            const foodData = nutritionData.foods[0];
            updateBurnInfo(foodData, newSize);
        }
    };

    return (
        <>
            <HeroSection title="Meal Search" showSearch={true} onSearchChange={handleSearchChange} onClick={fetchNutritionData} />
            {error && <p className="text-danger">Error: {error}</p>}
            {nutritionData && nutritionData.foods && nutritionData.foods.length > 0 && (
                <div className="main-div m-4">
                    <div className="card-body">
                        <img src={nutritionData.foods[0].photo.highres} className="card-img-top" alt={nutritionData.foods[0].food_name} />
                        <div className="card-title">
                            <h5>{nutritionData.foods[0].food_name}</h5>
                        </div>
                    </div>
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Nutrition Facts:</h6>
                        <input
                            type="number"
                            value={servingSize}
                            onChange={handleServingSizeChange}
                        />
                        <span>&nbsp;{nutritionData.foods[0].serving_unit}</span>
                        <span>&nbsp;({nutritionData.foods[0].serving_weight_grams}g)</span>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nutrient</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Calories</td>
                                    <td>{(nutritionData.foods[0].nf_calories * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} kcal</td>
                                </tr>
                                <tr>
                                    <td>Total Fat</td>
                                    <td>{(nutritionData.foods[0].nf_total_fat * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} g</td>
                                </tr>
                                <tr>
                                    <td>Cholesterol</td>
                                    <td>{(nutritionData.foods[0].nf_cholesterol * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} mg</td>
                                </tr>
                                <tr>
                                    <td>Sodium</td>
                                    <td>{(nutritionData.foods[0].nf_sodium * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} mg</td>
                                </tr>
                                <tr>
                                    <td>Total Carbohydrates</td>
                                    <td>{(nutritionData.foods[0].nf_total_carbohydrate * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} g</td>
                                </tr>
                                <tr>
                                    <td>Protein</td>
                                    <td>{(nutritionData.foods[0].nf_protein * (servingSize / nutritionData.foods[0].serving_qty)).toFixed(2)} g</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {burnInfo && (
                        <div className="card-body">
                            <h5 className="card-title">How long would it take to burn off these calories?</h5>
                            <ul className="list-unstyled">
                                <li>Walking (3mph): {burnInfo.walking} minutes</li>
                                <li>Running (6mph): {burnInfo.running} minutes</li>
                                <li>Bicycling (10mph): {burnInfo.bicycling} minutes</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}