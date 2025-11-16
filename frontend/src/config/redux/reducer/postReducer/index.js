import { getAllComments, getAllPosts } from "../../action/postAction"
import { createSlice } from "@reduxjs/toolkit"






const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments: [],
    postId: "",
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },
    },

    extraReducers: (builder) => {
        builder 
        .addCase(getAllPosts.pending, (state)=> {
            state.isLoading = true,
            state.message = "Fetching all the posts..."
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;

            const postsData = Array.isArray(action.payload.posts)
        ? action.payload.posts
        : [action.payload.posts];
            // state.posts = action.payload.posts.reverse();
            state.posts = postsData.reverse();
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.posts = action.payload
        })
        .addCase(getAllComments.fulfilled , (state, action) => {
            state.postId = action.payload.post_id,
            state.comments = action.payload.comments.comments
        })

    }

})

export const {resetPostId} = postSlice.actions


export default postSlice.reducer