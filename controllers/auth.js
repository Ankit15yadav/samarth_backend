const db = require('../utils/dbConnect');
const crypto = require('crypto');

const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                error: "Username and Password are required"
            });
        }

        // Hash the password
        const hashedPass = crypto.createHash('md5').update(password).digest("hex");

        // Query the database using pool with promise-based API
        const query = 'SELECT * FROM tb_login_master WHERE emp_name = ? AND emp_pass = ?';

        const [results] = await db.query(query, [username, hashedPass]);

        //check user present or not
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = results[0];

        // Successful login
        return res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tb_login_master");
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send("Internal Server Error");
    }
};

const updateLocation = async (req, res) => {
    try {

        const { user, location } = req.body;

        if (!user || !location) {
            console.log("Error getting user or location");
            throw new Error("Error while validating user or location");
        }

        const query = `
        INSERT INTO tb_login_trans 
        (emp_id, emp_name, emp_category, login_datetime, logout_datetime, total_dur, latitude, longitude)
        VALUES (?, ?, ?, NOW(), NULL, 0, ?, ?)
    `;

        const [result] = await db.query(query, [
            user.emp_id,
            user.emp_name,
            user.emp_category,
            location.latitude,
            location.longitude
        ]);

        res.status(200).json({
            success: true,
            message: "Location updated successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error,
        })
    }
}

module.exports = { signIn, getUsers, updateLocation }

