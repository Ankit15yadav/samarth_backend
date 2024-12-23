const db = require("../utils/dbConnect");

const Expense = async (req, res) => {
    try {

        const query = "SELECT * FROM tb_expn_master";

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(400).json({
                message: "Error while getting expense Details",
            })
        }

        return res.status(200).json({
            message: "Login successful",
            results
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })
    }
}

const Tsid = async (req, res) => {
    try {

        const { zone_id } = req.body;

        const query = 'SELECT * FROM tb_location_master WHERE zone_id = ?';

        const [result] = await db.query(query, [zone_id]);

        if (result.length === 0) {
            return res.status(400).json({
                message: "Error while getting TSID Details",
            })
        }

        return res.status(200).json({
            succes: true,
            data: result
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })
    }
}

module.exports = { Expense, Tsid }