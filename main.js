require('dotenv').config();

const express=require("express")
const mongoose=require("mongoose")
const multer=require("multer")
const app=express()
const cors=require("cors")
app.use(cors())
const npt=require("./Model")
const path=require('path')
const mode1=require("./model1")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

try{
    mongoose.connect(process.env.MONGO_URI)
    console.log("db connected")
}
catch(error){
    console.log(error)
}
const upload=multer({"storage":storage})
app.post("/post",upload.single('image'),(req,res)=>{
    const path1=`http://localhost:4000/uploads/${req.file.filename}`
    
    const amn=new npt({image:path1,text:req.body.text})
    try{
        amn.save()
        console.log("sended to db")
        res.send("verified")
        console.log(amn)
    }
    catch(error){
        console.log(error)
    }
})
app.get("/get",async(req,res)=>{
    const am=await npt.find()
    res.json(am)
    console.log(am)
})

app.post('/send',upload.single('image'),(req,res)=>{
    const fi=`http://localhost:4000/uploads/${req.file.filename}`
    const oi=new mode1({image:fi,text:req.body.text})
    try{
        oi.save()
        console.log("send to db")
        res.send("sended to db")
    }
    catch(error){
        console.log(error)
    }
})
app.get('/take',async(req,res)=>{
    const ner=await mode1.find().lean()
    try{
        res.json(ner)
    }
    catch(error){
        console.log(error)
    }
})
app.get("/",async(req,res)=>{
 res.send("ok")
    
})
app.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port 4000");
});
