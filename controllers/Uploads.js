const { uploadImageToCloudinary } = require('../utils/imageUploader');
const db = require('../utils/dbConnect');

const uploadExpense = async (req, res) => {
    try {
        // console.log('Request body:', req.body);
        // console.log('Request files:', req.files);

        const { zone_id, zone_name, emp_id, emp_name, expn_id, expn_name, expn_amount, tr_date, datetime, description } = req.body;

        if (!zone_id || !zone_name || !emp_id || !emp_name || !expn_id || !expn_name || !expn_amount || !description) {
            return res.status(400).json({
                success: false,
                error: "All required fields must be provided."
            });
        }

        let imageUrl = '';
        if (req.files && req.files.file) {
            const file = req.files.file;
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

                imageUrl = image.secure_url;
                // console.log('Uploaded image URL:', imageUrl);
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

        const query = 'INSERT INTO tb_expn_trans (zone_id, zone_name, emp_id, emp_name, expn_id, expn_name, expn_amount, tr_date, image_path, datetime, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        const [result] = await db.query(query, [zone_id, zone_name, emp_id, emp_name, expn_id, expn_name, expn_amount, tr_date, imageUrl, datetime, description]);

        res.status(200).json({
            success: true,
            message: "Expense inserted successfully",
        });

    } catch (error) {
        console.error("Error during expense insertion:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: error.message,
        });
    }
}

const uploadTSID = async (req, res) => {
    try {

        const { zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date } = req.body;

        console.log(zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date);

        if (!zone_id || !zone_name || !state_id || !state_name || !location_id || !location_tsid || !survey_start || !emp_id || !emp_name || !submission_date) {
            throw new Error("All fields are required");
        }

        const query = "INSERT INTO tb_survey_master (zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const [result] = await db.query(query, [zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date])

        if (!result) {
            throw new Error("tsid not inserted in db");
        }

        return res.status(200).json({
            message: true,
            data: result
        })

    } catch (error) {
        console.error("Error during tsid insertion:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

module.exports = { uploadExpense, uploadTSID }