import React from "react";
import "./MealCard.css";
const MealCard = ({ meal, nutrition, mealTitle }) => {
  if (!nutrition) {
    return <p>No nutrition data available for {meal.title}</p>;
  }

  return (
    <div className="meal-card card border p-4 rounded-md shadow-lg mb-4">
      <h4 className="text-xl font-bold">{mealTitle}</h4>
      <h3 className="text-xl font-bold">{nutrition.food_name}</h3>
      <div className="d-flex mt-2 meal-main">
        <div className="meal-pic m-2">
          <img src={nutrition.photo.thumb} alt={nutrition.food_name} />
        </div>
        <div className="meal-info">
          <p>{nutrition.serving_qty} servings</p>
          <p>
            <span className="calories">
              {Math.round(nutrition.nf_calories)}
            </span>{" "}
            Kcal
          </p>
          <p className="nutrient-item protein">
            <div className="label"></div>PROTEIN&nbsp; &nbsp;
            {Math.round(nutrition.nf_protein)} g
          </p>
          <p className="nutrient-item fat">
            {" "}
            <div className="label"></div>FAT &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
            &nbsp; {Math.round(nutrition.nf_total_fat)} g
          </p>
          <p className="nutrient-item carb">
            <div className="label"></div>CARB&nbsp; &nbsp; &nbsp; &nbsp;
            {Math.round(nutrition.nf_total_carbohydrate)} g
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
