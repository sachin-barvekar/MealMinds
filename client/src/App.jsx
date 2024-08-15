import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MealPlan from './pages/MealPlan';
import MealSearch from './pages/MealSearch';
import Footer from './components/Footer';
import './index.css'

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<MealPlan />} />
                <Route path="/meal-search" element={<MealSearch />} />
            </Routes>
            <Footer/>
        </Router>
    );
};

export default App;
