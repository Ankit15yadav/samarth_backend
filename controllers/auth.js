const db = require('../utils/dbConnect');
const crypto = require('crypto');
const jwt = require("jsonwebtoken")
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { use } = require('express-fileuploader');

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

        const token = jwt.sign({
            emp_name: user.emp_name,
            emp_id: user.emp_id,
            emp_category: user.emp_category
        },
            process.env.JWT_SECRET, { expiresIn: '5m' }
        )

        user.token = token;
        user.emp_pass = 0;

        // console.log(user);

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


const signUp = async (req, res) => {
    try {
        // console.log('Request body:', req.body);
        // console.log('Request files:', req.files);
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                error: "Username is required"
            });
        }

        let imageUri = '';
        if (req.files && req.files.image) {
            const file = req.files.image;
            try {
                const image = await uploadImageToCloudinary(
                    file.tempFilePath,
                    process.env.FOLDER_NAME,
                    1000,
                    1000
                );

                if (!image.secure_url) {
                    throw new Error("Unable to upload image");
                }

                imageUri = image.secure_url;
            } catch (uploadError) {
                console.error("Error uploading to Cloudinary:", uploadError);
                return res.status(500).json({
                    success: false,
                    error: "Error uploading image",
                    message: uploadError.message
                });
            }
        } else {
            console.log('No file uploaded');
        }

        const query = `INSERT INTO tb_login_master (emp_name, image_path) VALUES (?, ?)`;

        const [result] = await db.query(query, [username, imageUri]);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error,
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
            VALUES (?, ?, ?, ?, NULL, 0, ?, ?)
        `;

        const [result] = await db.query(query, [
            user.emp_id,
            user.emp_name,
            user.emp_category,
            new Date(),
            location.latitude,
            location.longitude,
        ]);

        // Query to fetch the insertion timestamp
        const timestampQuery = `
            SELECT login_datetime 
            FROM tb_login_trans 
            WHERE id = ?
        `;
        const [timestampResult] = await db.query(timestampQuery, [result.insertId]);

        const insertedTime = timestampResult[0]?.login_datetime;

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            data: insertedTime, // Return the insertion time
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};


module.exports = { signIn, getUsers, updateLocation, signUp }

