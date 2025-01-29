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
            message: "expense fetching successful",
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

const imageType = async (req, res) => {
    try {

        const query = 'SELECT * FROM tb_image_name_master';

        const [result] = await db.query(query);

        if (result.length === 0) {
            return res.status(400).json({
                message: "Error while getting Image Type Details",
            })
        }

        return res.status(200).json({
            succes: true,
            result
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })

    }
}

const updateExpense = async (req, res) => {

    try {

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const query = 'UPDATE tb_expn_trans '

    } catch (error) {

    }
}

const getOneExpense = async (req, res) => {
    try {

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const query = 'SELECT * FROM tb_expn_trans WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(400).json({
                message: "Error while getting Expense Details",
            })
        }

        return res.status(200).json({
            success: true,
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

// const upDateExpense = async

module.exports = { Expense, Tsid, imageType, getOneExpense }