const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check authenticity of the user
exports.auth = (req, res, next) => {
    try {
        // Extract JWT token
        const token = req.body.token || req.cookies.MealMinds;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode; // Store the decoded token in request object
            next(); // Go to next middleware
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while verifying the token',
            error: error.message,
        });
    }
};