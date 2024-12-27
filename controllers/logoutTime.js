const db = require("../utils/dbConnect");

const logoutTime = async (req, res) => {
    try {
        const { emp_id, longitude, latitude } = req.body;

        // Validate if emp_id is provided
        if (!emp_id) {
            return res.status(400).json({
                message: "Employee ID is required"
            });
        }

        // if (!latitude || !longitude) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Location data (latitude and longitude) is required"
        //     });
        // }

        // Query to fetch records for the specific emp_id
        const query = `
            SELECT * 
            FROM tb_login_trans 
            WHERE emp_id = ?
            ORDER BY login_datetime DESC LIMIT 1
        `;

        // Execute the query with emp_id as a parameter
        const [result] = await db.query(query, [emp_id]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No login record found for the specified Employee ID"
            });
        }


        const loginTime = result[0].login_datetime;
        const logoutTime = new Date();

        const diffMilliseconds = logoutTime - loginTime;

        const diffSeconds = Math.floor(diffMilliseconds / 1000);

        const location = {
            latitude,
            longitude
        };

        try {

            const query = `
            INSERT INTO tb_login_trans 
            (emp_id, emp_name, emp_category, login_datetime, logout_datetime, total_dur, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const [response] = await db.query(query,
                [result[0].emp_id, result[0].emp_name, result[0].emp_category, loginTime, logoutTime, diffSeconds, location.latitude, location.longitude]);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Error updating location"
                });
            }


        } catch (error) {
            console.error("Error updating location:", error);
            return res.status(500).json({
                success: false,
                message: "Error updating location",
                error: error.message
            });

        }

        return res.status(200).json({
            success: true,
            message: "Logout Time fetched successfully",
            result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { logoutTime };
