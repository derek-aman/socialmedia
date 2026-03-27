import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      // ✅ token formData se hata — interceptor handle karega
      formData.append('body', body);
      if (file) formData.append('media', file);

      const response = await clientServer.post("/post", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return thunkAPI.fulfillWithValue("Post Uploaded");
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      // ✅ token data se hata
      const response = await clientServer.delete("/delete_post", {
        data: { post_id: post_id.post_id }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      // ✅ token hata
      const response = await clientServer.post("/comment", {
        post_id: commentData.post_id,
        commentBody: commentData.body
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

// incrementPostLike aur getAllComments — already theek hain, token nahi tha

export const incrementPostLike = createAsyncThunk(
    "post/incrementLike",

    async (post, thunkAPI) => {
        try{
            const response = await clientServer.post(`/increment_post_like`,{
                post_id: post.post_id
            })

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkAPI) => {
        try{
            const response = await clientServer.get('/get_comments', {
                params : {
                    post_id: postData.post_id
                }
            });

            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postData.post_id
            })

        } catch (error){
            return thunkAPI.rejectWithValue("Something  went wrong")
        }
    }
)

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get('/posts');
      console.log("POSTS RESPONSE:", response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);