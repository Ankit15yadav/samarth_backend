const db = require('../utils/dbConnect');

const GetApproval = async (req, res) => {

    try {
        const { emp_id } = req.body;

        const query = `SELECT * FROM tb_expn_trans WHERE emp_id = ? AND audit = ?`;

        const [result] = await db.query(query, [emp_id, 1]);

        // console.log(result);

        return res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {

    }
}

module.exports = {
    GetApproval
}