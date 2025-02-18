require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const cors = require("cors");
const npt = require("./Model");
const path = require('path');
const mode1 = require("./model1");

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("DB connected successfully");
})
.catch(error => {
  console.error("DB connection error:", error);
});

.then(() => {
    console.log("DB connected successfully");
})
.catch(error => {
    console.error("DB connection error:", error);
});

const upload = multer({ "storage": storage });

app.post("/post", upload.single('image'), (req, res) => {
    const path1 = `https://express-app-rn1m.onrender.com/uploads/${req.file.filename}`;
    
    const amn = new npt({ image: path1, text: req.body.text });
    try {
        amn.save();
        console.log("sended to db");
        res.send("verified");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error saving to database");
    }
});

app.get("/get", async (req, res) => {
    try {
        const am = await npt.find();
        res.json(am);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
    }
});

app.post('/send', upload.single('image'), (req, res) => {
    const fi = `https://express-app-rn1m.onrender.com/uploads/${req.file.filename}`;
    const oi = new mode1({ image: fi, text: req.body.text });
    try {
        oi.save();
        console.log("send to db");
        res.send("sended to db");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error saving to database");
    }
});

app.get('/take', async (req, res) => {
    try {
        const ner = await mode1.find().lean();
        res.json(ner);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
    }
});

app.get("/", async (req, res) => {
    res.send("ok");
});
const port = process.env.PORT || 4000;
app.listen(port|| 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});
