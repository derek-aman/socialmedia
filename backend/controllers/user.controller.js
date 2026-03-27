import User from '../models/user.model.js'
import bcrypt from "bcrypt"
import Profile from "../models/profile.model.js"
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import ConnectionRequest from '../models/connections.model.js'
import jwt from 'jsonwebtoken'; 
import redisClient from '../redis/redisClient.js'



export const activeCheck = async (req ,res ) => {
    return res.status(200).json({message: "RUNNING"})
}




const convertUserDataToPDF = (userData) => {
  return new Promise((resolve, reject) => {

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const fullPath = "uploads/" + outputPath;

    // Ensure uploads folder exists
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(fullPath);

    doc.pipe(stream);

    // Safe Profile Image
    const imagePath = `uploads/${userData.userId.profilePicture}`;
    if (userData.userId.profilePicture && fs.existsSync(imagePath)) {
      doc.image(imagePath, { width: 120, align: "center" });
    } else {
      doc.fontSize(12).text("No Profile Picture Available");
    }

    // Profile Details
    doc.fontSize(14).text(`Name : ${userData.userId.name}`);
    doc.text(`Username : ${userData.userId.userName}`);
    doc.text(`Email : ${userData.userId.email}`);
    doc.text(`Bio : ${userData.bio}`);
    doc.text(`Current Position : ${userData.currentPost}`);
    doc.moveDown();

    doc.text("Past Work :", { underline: true });
    userData.pastWork.forEach((work) => {
      doc.text(`Company: ${work.company}`);
      doc.text(`Position: ${work.position}`);
      doc.text(`Years: ${work.years}`);
      doc.moveDown();
    });

    doc.end();

    // VERY IMPORTANT — wait for stream to finish writing
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", (err) => reject(err));
  });
};





export const register = async (req, res) => {
  const { name, email, password, userName } = req.body;

  if (!name || !email || !password || !userName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password min 6 characters" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, userName });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    const token = jwt.sign(
      { _id: newUser._id },       // ✅ newUser — not user
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({ message: "User registered successfully", token });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req , res) => {
    
     if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try{

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.json({message : "Profile picture updated"})

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}

export const updateUserProfile = async (req , res)=>{
    
    try {
        const user = await User.findById(req.userId)
         if(!user) return res.status(404).json({message: "User does not found"})

        const { userName , email} = req.body;

        const existingUser = await User.findOne({ $or : [{userName}, {email}]});
        if(existingUser){
            if(existingUser && String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message: "Username or email already taken"})
            }
        }

        Object.assign(user, req.body);
        await user.save();

        return res.json({message: "User updated "})


    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const getUserAndProfile = async (req ,res) => {
    
    try{
        

        const userProfile = await Profile.findOne({userId: req.userId})
          .populate('userId', 'name email userName profilePicture ') ;
        return res.json(userProfile)

        

    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const updateProfileData = async (req , res)=>{
    
    try {

        const profile = await Profile.findOne({userId: req.userId});
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        

        Object.assign(profile, req.body);
        await profile.save();

        return res.json({message: "Profile updated "})


    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const getAllUserProfile =  async (req , res)=>{
    try{
        const cacheKey = "all_user_profiles";

        // 🔍 1. Check Redis first
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
        console.log("✅ Cache HIT");
        return res.json(JSON.parse(cachedData));
        }

        console.log("❌ Cache MISS");

        const profiles = await Profile.find().populate("userId",  "name email userName profilePicture ");
         const responseData = { profiles };

        // 💾 3. Store in Redis (TTL = 60 sec)
        await redisClient.setEx(
        cacheKey,
        60,
        JSON.stringify(responseData)
        );
        return res.json({
            profiles
        });
    } catch(error){
        return res.status(500).json({message: error.message})
    }
}







export const downloadProfile = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) return res.status(400).json({ message: "User ID required" });

    // Fetch profile
    const userData = await Profile.findOne({ userId: id })
      .populate("userId", "name email userName profilePicture");

    if (!userData) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Generate PDF (NOW WAITS UNTIL FINISHED!)
    const pdfFileName = await convertUserDataToPDF(userData);

    const filePath = `uploads/${pdfFileName}`;

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: "PDF not created" });
    }

    return res.download(filePath);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const sendConnectionRequest = async (req,res) => {
    const {  connectionId } = req.body;

    try {

        const connectionUser = await User.findById( connectionId);
        if(!connectionUser){
            return res.status(404.).json({messsage: " Connection  not found"})

        }
        
        const existingRequest = await ConnectionRequest.findOne({userId: req.userId, connectionId})
        if(existingRequest){
            return res.status(400.).json({messsage: " Requsest already sent"})

        }

        

        await ConnectionRequest.create({ userId: req.userId, connectionId });
         return res.json({ message: "Request Sent" });

    }catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionsRequest = async (req,res) => {
   
    try{
        const connections = await ConnectionRequest.find({userId: req.userId}).populate('connectionId', 'name userName email profilePicture ');
        return res.json({connections})

    }catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};
export const whatAreMyConnections = async (req,res) => {
    
    try {

        

        const connections = await ConnectionRequest.find({connectionId: req.userId}).populate('userId', 'name userName email profilePicture ');

        return res.json(connections);
        
    }catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
    const { requestId, actionType} = req.body;

    try {

        const connection = await ConnectionRequest.findById(requestId);
        if(!connection){
            return res.status(404).json({
                message: "Connection not found"
            })
        }
        connection.status_accepted = actionType === "accept";
        await connection.save();

        return res.json({message: "Request Updated"});
        
    }catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { userName } = req.query;

  try {
    const cacheKey = `profile_${userName}`; // 🔑 dynamic key

    // 🔍 1. Check Redis
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("✅ Cache HIT");
      return res.json(JSON.parse(cachedData));
    }

    console.log("❌ Cache MISS");

    // 🗄️ 2. DB queries
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name userName email profilePicture");

    const responseData = { Profile: userProfile };

    // 💾 3. Save in Redis (TTL = 60 sec)
    await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify(responseData)
    );

    return res.json(responseData);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

