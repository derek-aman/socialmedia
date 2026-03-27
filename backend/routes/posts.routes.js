import { Router } from "express";
import { activeCheck } from "../controllers/user.controller.js";
import { commentPost, createPost, deletePost, get_comments_by_post, getAllPosts, increment_likes ,delete_comment_of_user } from "../controllers/posts.controller.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const router  = Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. ".jpg"
    const uniqueName = `${uuidv4()}${ext}`;      // e.g. "a1b2c3d4-....jpg"
    cb(null, uniqueName);
  }
});

const upload =  multer({ storage: storage})

router.route('/').get(activeCheck)
router.route('/post').post(authMiddleware, upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(authMiddleware,deletePost);
router.route('/comment').post(authMiddleware,commentPost)
router.route('/get_comments').get(get_comments_by_post);
router.route('/delete_comment').delete(authMiddleware,delete_comment_of_user);
router.route('/increment_post_like').post(authMiddleware,increment_likes);



export default router;