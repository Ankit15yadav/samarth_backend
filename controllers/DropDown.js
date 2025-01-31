const db = require("../utils/dbConnect");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

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

const upDateExpense = async (req, res) => {
    try {

        // console.log("url hit 1");
        const { id } = req.body;

        // console.log(id);
        const { expn_id, expn_category, expn_amount, description, image } = req.body;
        // console.log(expn_id, expn_category, expn_amount, description, image);
        // Validation: Check for missing fields
        if (!id || !expn_id || !expn_category || !expn_amount || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // console.log("url hit2")


        let imageUrl = image || '';

        console.log(imageUrl)

        // Check if an image is uploaded
        if (req.files && req.files.file) {
            // console.log(req.files.file)
            const file = req.files.file;
            try {
                const uploadedImage = await uploadImageToCloudinary(
                    file.tempFilePath,
                    process.env.FOLDER_NAME,
                    1000,
                    1000
                );

                if (!uploadedImage.secure_url) {
                    throw new Error("Unable to upload image");
                }

                imageUrl = uploadedImage.secure_url;
            } catch (uploadError) {
                console.error("Error uploading to Cloudinary:", uploadError);
                return res.status(500).json({
                    success: false,
                    error: "Error uploading image",
                    message: uploadError.message
                });
            }
        }

        // Update Query
        const query = `UPDATE tb_expn_trans 
            SET expn_id = ?, expn_name = ?, expn_amount = ?, description = ?, image_path = ? , audit = ?
            WHERE id = ?;`;

        const [result] = await db.query(query, [expn_id, expn_category, expn_amount, description, imageUrl, 0, id]);

        // Check if update was successful
        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Expense not found or no update performed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully"
        });

    } catch (error) {
        console.error("Update Expense Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


module.exports = { Expense, Tsid, imageType, getOneExpense, upDateExpense }