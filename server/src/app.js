const express=require("express");
const mongoose=require("mongoose")
const bodyParser=require("body-parser");
const Lead=require("./models/LeadSchema");
const cors = require('cors');
const User=require("./models/userSchema");
const jwt=require("jsonwebtoken")
const coookieParser=require("cookie-parser");

const app=express();
const PORT=5000;
const SECRET_KEY="NAGSAICHALLA";

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(coookieParser());


function authenticateUser(req, res, next) {
    console.log("Got Request Authentication");
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json("Authorization header missing");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json("Token missing");
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // Attach user to request object
        console.log(req.user);
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json("Invalid Token");
    }
}



app.post("/login", async (req, res) => {
    try {
        console.log("Got Request For Login");
        console.log(req.body)
        const user = await User.findOne(req.body);
        if (!user) {
            return res.status(404).json("User Not Found");
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY); // Include email in token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post("/register",async (req,res)=>{
    try{
        console.log("Got Request for register")
        console.log(req.body)
        const newUser=new User(req.body);
        await newUser.save();
        console.log("saved Successfully")
        res.json(newUser);
    }
    catch(error){
        res.status(401).json({message:error.message});
    }
})

app.post("/lead",authenticateUser,async (req,res)=>{
    console.log("Got Request For Post Lead")
    console.log(req.body)
    try{
        console.log(req.body);
        const user=req.user;
        console.log(user)
        const newLead = new Lead({ userId: user.userId, ...req.body });
        await newLead.save();
        res.status(201).json(newLead);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

app.get("/lead",async (req,res)=>{
    console.log("Got Request for Gel all leads")
    try{
        const leads=await Lead.find();
        res.json(leads)
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

app.get("/my-lead",authenticateUser,async (req,res)=>{
    console.log("Got Request for Gel my leads")
    try{
        const user=req.user;
        const leads=await Lead.find({userId:user.userId});
        res.json(leads)
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

app.get("/lead/:id",async (req,res)=>{
    try{
        const {id}=req.params;
        const lead=await Lead.findOne({_id:id});
        res.json(lead);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

app.put("/lead/:id",async (req,res)=>{
    console.log("Got Request for edit lead")
    //console.log(req.body)
    try{
        const {id}=req.params;
        const data=req.body;
        console.log(id);
        console.log(data)
        const updated_lead=await Lead.findByIdAndUpdate(id,data,{new:true});
        if(!updated_lead){
            res.status(404).json("Lead Not Found");
            return;
        }
        res.json(updated_lead);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

app.delete("/lead/:id",async (req,res)=>{
    try{
        console.log("Got request For Delete Lead")
        const {id}=req.params;
        const data=req.body;
        console.log(id)
        const deleted_lead=await Lead.findByIdAndDelete(id);
        if(!deleted_lead){
            res.status(404).json("Lead Not Found");
        }
        res.json(deleted_lead);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})



mongoose.connect("mongodb+srv://nagasai:nagasai@nagasai.eqxip.mongodb.net/HomeMate?retryWrites=true&w=majority&appName=nagasai")
.then(()=>{
    console.log("DataBase Connected Successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
})


