import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">MealMinds</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-3 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Meal Plan</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/meal-search">Meal Search</Link>
                        </li>
                        <li className="nav-item">
                             <Link className="nav-link" to="/profile"> {currentUser ? 'Profile' : 'Sign in'}</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
