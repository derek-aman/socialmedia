import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';
import React, { useEffect, useState , useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import styles from './index.module.css';
// import { BASE_URL } from '@/config';
import { BASE_URL, getImageUrl } from '@/config';
import Image from 'next/image';
import { resetPostId } from '@/config/redux/reducer/postReducer';

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState('');
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState('');


  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent('');
    setFileContent(null);
    dispatch(getAllPosts());
  };

  const handleLike = async (postId) => {
  // Remove: setLikedPosts((prev) => new Set([...prev, postId]));
  await dispatch(incrementPostLike({ post_id: postId }));
  dispatch(getAllPosts());
};

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, authState.all_profiles_fetched, dispatch]);

const likedPosts = useMemo(() => {
  if (!postState.posts?.length || !authState.user) return new Set();
  return new Set(
    postState.posts
      .filter(post => post.likedBy?.includes(authState.user.userId?._id))
      .map(post => post._id)
  );
}, [postState.posts, authState.user]);


  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.loadingState}>
            <div className={styles.loadingPulse} />
            <div className={styles.loadingPulse} />
            <div className={styles.loadingPulse} />
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>

            {/* ── CREATE POST ── */}
            <div className={styles.createPostContainer}>
              <div className={styles.createPost_top}>
                <Image
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userId?.profilePicture}`}
                  alt="profile"
                  width={44}
                  height={44}
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  placeholder="What's on your mind?"
                  className={styles.textareaOfContent}
                  rows={3}
                />
              </div>

              <div className={styles.createPost_actions}>
                <label htmlFor="fileUpload" className={styles.attachBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  <span>Attach</span>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files[0])}
                  type="file"
                  hidden
                  id="fileUpload"
                />
                {fileContent && (
                  <span className={styles.fileName}>{fileContent.name}</span>
                )}
                <button
                  onClick={handleUpload}
                  className={`${styles.uploadButton} ${postContent.length === 0 ? styles.uploadButtonDisabled : ''}`}
                  disabled={postContent.length === 0}
                >
                  Publish
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── POSTS FEED ── */}
            <div className={styles.postsContainer}>
              {(Array.isArray(postState.posts) ? postState.posts : [postState.posts])
                .filter(Boolean)
                .map((post, i) => (
                  <div
                    key={post._id}
                    className={styles.singleCard}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Card header */}
                    <div className={styles.singleCard_profileContainer}>
                      <Image
                        className={styles.cardProfile}
                        src={`${BASE_URL}/${post.userId?.profilePicture}`}
                        alt="user"
                        width={44}
                        height={44}
                      />
                      <div className={styles.cardMeta}>
                        <div className={styles.cardMeta_top}>
                          <span className={styles.postUserName}>{post.userId?.name}</span>
                          {post.userId?._id === authState.user.userId?._id && (
                            <button
                              className={styles.deleteBtn}
                              onClick={async () => {
                                await dispatch(deletePost({ post_id: post._id }));
                                await dispatch(getAllPosts());
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <span className={styles.postUserHandle}>@{post.userId?.userName}</span>
                      </div>
                    </div>

                    {/* Post body */}
                    <div className={styles.postBody}>
                      <p>{post.body}</p>
                      {post.media && (
                        <div className={styles.postImageWrapper}>
                          <Image
                            src={`${BASE_URL}/${post.media}`}
                            alt="post-media"
                            className={styles.postImage}
                            width={800}
                            height={500}
                            sizes="100vw"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={styles.optionsContainer}>
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`${styles.actionBtn} ${likedPosts.has(post._id) ? styles.actionBtnLiked : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={likedPosts.has(post._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => dispatch(getAllComments({ post_id: post._id }))}
                        className={styles.actionBtn}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <span>Reply</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = encodeURIComponent(post.body);
                          const url = encodeURIComponent('apnacollege.in');
                          window.open(`http://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                        }}
                        className={styles.actionBtn}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── COMMENTS MODAL ── */}
        {postState.postId !== '' && (
          <div
            className={styles.modalBackdrop}
            onClick={() => dispatch(resetPostId())}
          >
            <div
              className={styles.modalPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>Replies</span>
                <button
                  className={styles.modalClose}
                  onClick={() => dispatch(resetPostId())}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className={styles.commentsList}>
                {postState.comments.length === 0 ? (
                  <div className={styles.emptyComments}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    <p>No replies yet</p>
                  </div>
                ) : (
                  postState.comments.map((comment) => (
                    <div key={comment._id} className={styles.singleComment}>
                      <Image
                        className={styles.commentAvatar}
                        src={`${BASE_URL}/${authState.user.userId?.profilePicture}`}
                        alt="user"
                        width={36}
                        height={36}
                      />
                      <div className={styles.commentContent}>
                        <div className={styles.commentMeta}>
                          <span className={styles.commentName}>{comment.userId.name}</span>
                          <span className={styles.commentHandle}>@{comment.userId?.userName}</span>
                        </div>
                        <p className={styles.commentBody}>{comment.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.commentInputArea}>
                <Image
                  className={styles.commentAvatar}
                  src={`${BASE_URL}/${authState.user.userId?.profilePicture}`}
                  alt="me"
                  width={36}
                  height={36}
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a reply…"
                  className={styles.commentInput}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && commentText.trim()) {
                      await dispatch(postComment({ post_id: postState.postId, body: commentText }));
                      await dispatch(getAllComments({ post_id: postState.postId }));
                      setCommentText('');
                    }
                  }}
                />
                <button
                  className={styles.commentSubmitBtn}
                  onClick={async () => {
                    if (!commentText.trim()) return;
                    await dispatch(postComment({ post_id: postState.postId, body: commentText }));
                    await dispatch(getAllComments({ post_id: postState.postId }));
                    setCommentText('');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;