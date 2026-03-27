import { Router } from "express";
import { acceptConnectionRequest, activeCheck, downloadProfile, getAllUserProfile, getMyConnectionsRequest, getUserAndProfile, getUserProfileAndUserBasedOnUsername, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture, whatAreMyConnections } from "../controllers/user.controller.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";

const router  = Router();

const storage = multer.diskStorage({
    destination: (req , file,cb) => {
        cb(null, 'uploads/')

    },
    filename : (req , file,cb) => {
        cb(null, file.originalname);
    }
})

const upload =  multer({ storage: storage})
router.route("/update_profile_picture")
.post(authMiddleware,upload.single('profile_picture'),uploadProfilePicture)

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(authMiddleware,updateUserProfile);
router.route('/get_user_and_profile').get(authMiddleware,getUserAndProfile)
router.route('/update_profile_data').post(authMiddleware,updateProfileData)
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(authMiddleware,sendConnectionRequest);
router.route('/user/getConnectionRequest').get(authMiddleware,getMyConnectionsRequest);
router.route('/user/user_connection_request').get(authMiddleware,whatAreMyConnections);
router.route('/user/accept_connection_request').post(authMiddleware,acceptConnectionRequest);
router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserBasedOnUsername);




export default router;