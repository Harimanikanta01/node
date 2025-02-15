
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const cors = require("cors");
const path = require('path');
const npt = require("./Model");
const mode1 = require("./model1");

app.use(cors());

const url = "mongodb+srv://punugulahari1:12345@cluster0.fmy2e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

const storage = multer.memoryStorage(); // Use memory storage for Vercel
const upload = multer({ storage });

app.post("/post", upload.single('image'), (req, res) => {
    const file = req.file;
    // Upload file to cloud storage and get the URL
    const fileUrl = "https://your-cloud-storage-url.com/" + file.originalname;
    
    const amn = new npt({ image: fileUrl, text: req.body.text });
    amn.save()
        .then(() => res.send("Verified"))
        .catch(err => res.status(500).send(err));
});

app.get("/get", async (req, res) => {
    const am = await npt.find();
    res.json(am);
});

app.post('/send', upload.single('image'), (req, res) => {
    const file = req.file;
    // Upload file to cloud storage and get the URL
    const fileUrl = "https://your-cloud-storage-url.com/" + file.originalname;
    
    const oi = new mode1({ image: fileUrl, text: req.body.text });
    oi.save()
        .then(() => res.send("Sent to DB"))
        .catch(err => res.status(500).send(err));
});

app.get('/take', async (req, res) => {
    const ner = await mode1.find().lean();
    res.json(ner);
});

app.get("/", async (req, res) => {
    const am = await npt.find();
    res.json(am);
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port " + (process.env.PORT || 4000));
});