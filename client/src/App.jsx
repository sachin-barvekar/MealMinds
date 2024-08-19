import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import MealForm from './components/MealForm';
import PrivateRoute from './components/PrivateRoute';
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
                <Route path='/create' element={<MealForm/>}/>
                <Route path="/meal-search" element={<MealSearch />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
            </Routes>
            <Footer/>
        </Router>
    );
};

export default App;
