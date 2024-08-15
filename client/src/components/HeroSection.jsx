import React, { useState } from 'react';
import './HeroSection.css';

export default function HeroSection({ title, showSearch, onSearchChange, onClick }) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        onSearchChange(value); 
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
            </div>
        </div>
    );
}