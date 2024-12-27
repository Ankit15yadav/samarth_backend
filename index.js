const express = require('express')
const db = require("./utils/dbConnect")
const app = express();
const authRoutes = require("./routes/authRoutes");
const DropDown = require("./routes/dropDownRoutes")
const uploads = require("./routes/Uploads")
const time = require("./routes/time")
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require('./utils/cloudinary');
const compression = require('compression');

const PORT = 4000

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
cloudinaryConnect();

app.get('/', (req, res) => {
    res.send("hello this is the home page");
})

app.use('/api/v1', authRoutes)
app.use('/api/v1/menu', DropDown)
app.use('/api/v1/upload', uploads)
app.use('/api/v1/time', time)


app.listen(PORT, () => console.log('Server running on port 4000'));