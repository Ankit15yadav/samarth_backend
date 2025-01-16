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

        const { zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date, direction1, direction2 } = req.body;

        // console.log(zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date);

        if (!zone_id || !zone_name || !state_id || !state_name || !location_id || !location_tsid || !survey_start || !emp_id || !emp_name || !submission_date) {
            throw new Error("All fields are required");
        }

        const query = "INSERT INTO tb_survey_master (zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date, direction1, direction2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

        const [result] = await db.query(query, [zone_id, zone_name, state_id, state_name, location_id, location_tsid, survey_start, emp_id, emp_name, submission_date, direction1, direction2])

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

const photoUpload = async (req, res) => {
    try {

        const { zone_id, zone_name, tsid, imageType, description, emp_id, emp_name } = req.body;

        if (!zone_id || !zone_name || !tsid || !imageType || !description || !emp_id || !emp_name) {
            throw new Error("All fields are required");
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
        }
        else {
            console.log('No file uploaded');
        }

        const query = 'INSERT INTO tb_photo_upload_trans (zone_id , zone_name, tsid, jpg_type, datetime , jpg_path , emp_id , emp_name) VALUES (?,?,?,?,?,?,?,?)';

        const [result] = await db.query(query, [zone_id, zone_name, tsid, imageType, new Date(), imageUrl, emp_id, emp_name]);

        if (!result) {
            throw new Error("photo upload form failed");
        }

        return res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {
        console.error("Error during photo upload:", error);
    }
}

const uploadedImage = async (req, res) => {
    try {
        const { emp_id } = req.body;

        if (!emp_id) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const query = 'SELECT * FROM tb_photo_upload_trans WHERE emp_id = ? ORDER BY id DESC';
        const [result] = await db.query(query, [emp_id]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No images found' });
        }

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error during fetching image:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const deleteImage = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const query = 'DELETE FROM tb_photo_upload_trans WHERE id = ?';

        const [result] = await db.query(query, [id]);

        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: result,
        });

    } catch (error) {
        console.error('Error during deleting image:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports = { uploadExpense, uploadTSID, photoUpload, uploadedImage, deleteImage };
