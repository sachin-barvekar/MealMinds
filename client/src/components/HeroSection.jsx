import React, { useState } from 'react';
import './HeroSection.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HeroSection({ title, showSearch, onSearchChange, onClick, showCreateMealButton, showDeleteMealPlanButton }) {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        onSearchChange(value);
    };

    const deleteHandler = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete your meal plan?");
            if (confirmDelete) {
                await axios.delete(`/api/v1/meal-plan/delete`); // Adjust the endpoint accordingly
                alert('Meal plan deleted successfully!');
                navigate('/'); // Redirect to homepage or any other page after deletion
            }
        } catch (error) {
            console.error("Error deleting meal plan:", error);
            alert('Failed to delete meal plan. Please try again.');
        }
    };

    return (
        <div id="hero-section">
            <div id="hero-text">
                <h1>{title}</h1>
                
                {showSearch && (
                    <div id="search-bar">
                        <input
                            type="text"
                            placeholder="Search Meal..."
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        <br />
                        <button onClick={onClick}>Search</button>
                    </div>
                )}
                
                {showCreateMealButton && (
                    <Link to="/create">
                        <button className="create-meal-btn">Create Meal Plan</button>
                    </Link>
                )}
                &nbsp;
                {showDeleteMealPlanButton && (
                    <button onClick={deleteHandler}>Delete Meal Plan</button>
                )}
                
                {showCreateMealButton && (
                    <div className="nutrition-quote">
                        <br />
                        <p className='text-white'>If you are unsure about nutrition facts, start by exploring healthy meal options.</p>
                        <Link to="/meal-search" className='text-white'>
                        Explore Meal Search
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
