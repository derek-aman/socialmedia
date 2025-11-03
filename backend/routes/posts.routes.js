import { Router } from "express";
import { activeCheck } from "../controllers/user.controller.js";
import { commentPost, createPost, deletePost, get_comments_by_post, getAllPosts, increment_likes } from "../controllers/posts.controller.js";
import multer from "multer";

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

router.route('/').get(activeCheck);
router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').post(deletePost);
router.route('/delete_post').post(deletePost);
router.route('/get_comments').get(get_comments_by_post);
router.route('/delete_comment').delete(deletePost);
router.route('/increment_post_like').post(increment_likes);



export default router;