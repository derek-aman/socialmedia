import User from '../models/user.model.js'
import bcrypt from "bcrypt"
import Profile from "../models/profile.model.js"
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import fs from 'fs'

export const activeCheck = async (req ,res ) => {
    return res.status(200).json({message: "RUNNING"})
}




const convertUserDataToPDF = async (userData) => {
     
  
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const fullPath = "uploads/" + outputPath;
  const stream = fs.createWriteStream(fullPath);

  doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });
    doc.fontSize(14).text(`Name : ${userData.userId.name}`);
    doc.fontSize(14).text(`Username : ${userData.userId.userName}`);
    doc.fontSize(14).text(`Email : ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio : ${userData.bio}`);
    doc.fontSize(14).text(`Current Position : ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name: ${work.companyName} `)
        doc.fontSize(14).text(`Position: ${work.position} `)

        doc.fontSize(14).text(`Years: ${work.years} `)


    })

    doc.end();

    return outputPath;


}

export const register = async (req , res )=> {
    try{
        console.log("Request body:", req.body); // debug line
        const {name , email, password, userName} = req.body;
        if(!name || !email || !password || !userName) return res.status(400).json({message: "All fields are required"})

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message: "User already exists"})
        
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userName
        });
        await newUser.save();

        const profile = new Profile({userId: newUser._id});
        await profile.save();
        return res.json({message: "User registered successfully"})
    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const login = async (req , res )=> {
    try{
        console.log("Request body:", req.body); // debug line
        const { email, password} = req.body;
        if(!email || !password ) return res.status(400).json({message: "All fields are required"})

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({message: "User does not exists"})
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({message: "Invalid credentials"})
            // to save user for days
        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id: user._id}, {token});
        return res.json({message: "login successfully", token})
    
    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const uploadProfilePicture = async (req , res) => {
    const{token} = req.body;
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
     if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try{

        const user = await User.findOne({ token: token});

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
    const {token, ...newUserData} = req.body;
    try {
        const user = await User.findOne({
            token : token
        });
         if(!user) return res.status(404).json({message: "User does not found"})

        const { userName , email} = newUserData;

        const existingUser = await User.findOne({ $or : [{userName}, {email}]});
        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message: "User already exists"})
            }
        }

        Object.assign(user, newUserData);
        await user.save();

        return res.json({message: "User updated "})


    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const getUserAndProfile = async (req ,res) => {
    
    try{
        const {token } = req.body;
        const user = await User.findOne({
            token : token
        });
        if(!user) return res.status(404).json({message: "User does not found"})

        const userProfile = await Profile.findOne({userId: user._id})
          .populate('userId', 'name email userName profilePicture ') ;
        return res.json(userProfile)

        

    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const updateProfileData = async (req , res)=>{
    
    try {
        const {token, ...newProfileData} = req.body;
        const userProfile = await User.findOne({
            token : token
        });
        if(!userProfile) return res.status(404).json({message: "User does not found"})

        

        const profile_to_update = await Profile.findOne({userId: userProfile._id});
        

        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();

        return res.json({message: "Profile updated "})


    } catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const getAllUserProfile =  async (req , res)=>{
    try{
        const profiles = await Profile.find().populate("userId",  "name email userName profilePicture ")
        return res.json({
            profiles
        });
    } catch(error){
        return res.status(500).json({message: error.message})
    }
}





export const downloadProfile = async (req, res) => {
  try {
    const userId = req.query.id; // ✅ read from query

    if (!userId) {
      return res.status(400).json({ message: "userId (query param 'id') is required" });
    }

    const userProfile = await Profile.findOne({ userId }).populate(
      "userId",
      "name email userName profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found for given userId" });
    }

    const outputPath = await convertUserDataToPDF(userProfile);

    // ✅ Optional: directly send file for download
    return res.download(outputPath, "resume.pdf", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error downloading PDF" });
      }
    });
  } catch (error) {
    console.error("Error generating profile PDF:", error);
    return res.status(500).json({ message: error.message });
  }
};
