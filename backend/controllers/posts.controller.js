import Post from '../models/posts.model.js'
import Comment from '../models/comments.model.js'
import redisClient from '../redis/redisClient.js'

export const createPost = async (req, res) => {
  try {
    const post = new Post({
      userId: req.userId, // ✅ middleware se
      body: req.body.body,
      media: req.file ? req.file.filename : "",
      fileType: req.file ? req.file.mimetype.split("/")[1] : ""
    });

    await post.save();
    await redisClient.del("all_posts");
    return res.status(201).json({ message: "Post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const cacheKey = "all_posts";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData)); // ✅ { posts: [...] }
    }

    const posts = await Post.find()
      .populate('userId', 'name userName email profilePicture')
      .sort({ createdAt: -1 });

    const responseData = { posts };
    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));
    
    return res.json(responseData); // ✅ { posts: [...] } — no double wrap
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    await redisClient.del("all_posts");
    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { post_id, commentBody } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      userId: req.userId, // ✅ middleware se
      postId: post_id,
      body: commentBody
    });

    await comment.save();
    return res.status(201).json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// public — no auth needed
export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const cacheKey = `comments_${post_id}`;
    const cachedData = await redisClient.get(cacheKey);

    if(cachedData){
        console.log("Cache Hit");
        return res.json(JSON.parse(cachedData));
    }

    console.log("Cache Hit");
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name userName")
      .sort({ createdAt: -1 }); // ✅ reverse() ki jagah DB level sort
    const responseData = {comments};
    await redisClient.setEx(cacheKey,30,JSON.stringify(responseData));
    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { comment_id } = req.body;
  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id }); // ✅ deletePost bug fix
    return res.json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ prevent same user liking twice
    if (post.likedBy.includes(req.userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likedBy.push(req.userId);
    post.likes = post.likedBy.length;
    await post.save();

    await redisClient.del("all_posts");

    return res.json({ message: "Liked", likes: post.likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};