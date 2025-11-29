import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school:{
        type: String,
        default : 'Haldia Institute Of Technology'
    },
    degree:{
        type: String,
        default : 'Btech'
    },
    fieldOfStudy:{
        type: String,
        default : 'Electrical Engineering'
    }
});

const workSchema = new mongoose.Schema({
    company:{
        type: String,
        default : 'Google'
    },
    position:{
        type: String,
        default : 'SDE1'
    },
    years:{
        type: String,
        default : '2'
    },
});

const ProfileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    bio:{
        type: String,
        default : 'I am a MERN stack developer '
    },
    currentPost:{
        type: String,
        default : 'FUll stack developer'
    },
    education:{
        type: [educationSchema],
        default : []
    },
    pastWork:{
        type: [workSchema],
        default : [
            {
      company: "Google",
      position: "SDE1",
      years: "2"
    }
        ]
    },
});

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;


