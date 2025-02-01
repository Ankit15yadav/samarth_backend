const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authentication = async (req, res, next) => {
    try {

        const token = req.body || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        console.log("token", token)

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded", decode);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })
    }
}