import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser, getConnectionRequest,getMyConnectionsRequests,sendConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

const ProfilePage = () => {
    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.postReducer)
    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAboutUser({token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    },[])

    useEffect(() => {
        
        if(authState.user != undefined){
            setUserProfile(authState.user)
            let post = postReducer.posts.filter((post) => {
      return post?.userId?.username === authState.user.userName
    })
    setUserPosts(post);
        }
        
    
    
          
    }, [authState.user, postReducer.posts])

    

  return (
    <div>
      <UserLayout>
        <DashboardLayout>
        {authState.user &&  userProfile?.userId &&

        
             <div className={styles.container}>

      {/* COVER PHOTO + PROFILE IMAGE */}
      <div className={styles.coverSection}>
        <div className={styles.coverOverlay}></div>

        <img
          className={styles.profileImage}
          src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
          alt="profile"
        />
      </div>

      {/* PROFILE CONTENT */}
      <div className={styles.profileContent}>

        {/* NAME + USERNAME */}
        <div className={styles.nameSection}>
          <h2>{userProfile?.userId?.name}</h2>
          <p className={styles.username}>@{userProfile?.userId?.userName}</p>
        </div>

        {/* STATS */}
        <div style={{display: "flex", gap: "0.7rem"}}>
        <div style={{flex: "0.8"}} className={styles.statsRow}>
          <div>
            <h3>128</h3>
            <p>Posts</p>
          </div>
          <div>
            <h3>4.2K</h3>
            <p>Followers</p>
          </div>
          <div>
            <h3>230</h3>
            <p>Following</p>
          </div>
        </div>
        <div style={{flex: "0.2"}} >
        <h3>Recent Activity</h3>
        {userPosts.map((post) => {
          return (
            <div key={post._id} className={styles.postCard}>
            <div className={styles.card}>
            <div className={styles.card_profileContainer}>
            {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt=''/> : <div style={{width: "3.4rem", height: "3.4rem"}}></div>}

            </div>
            <p>{post.body}</p>

            </div>
              
            </div>

          )
        }) }

        </div>
        </div>

        {/* ACTION BUTTONS */}
        {/* <div className={styles.actionButtons}>
          <button className={styles.btnPrimary}>Connect</button>
          <button className={styles.btnSecondary}>Message</button>
        </div> */}
          <div style={{display : "flex", alignItems: "center", gap: "1.2rem"}}>
        

        <div onClick={() => {
    window.open(`${BASE_URL}/user/download_resume?id=${userProfile.userId._id}`, "_blank");
}} style={{cursor : "pointer"}}>
          <svg  style={{width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>

        </div>
        </div>

        {/* BIO SECTION */}
        <div className={styles.bioBox}>
          <h4>Bio</h4>
          <p>
            {userProfile?.bio ||
              "No bio added yet. This space can contain user’s introduction, skills, hobbies or profession."}
          </p>
        </div>

      </div>

      <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {
                  userProfile.pastWork.map((work , index) => {
                    return (
                      <div className={styles.workHistoryCard}>
                      <p style={{ fontWeight: "bold", display:"flex", alignItems: "center", gap:"0.8rem"}}>{work.company} - {work.position}</p>
                      <p>{work.years} years</p>
                      </div>
                    )
                  })
                }
              </div>
      </div>
    </div>
    }
        </DashboardLayout>
      </UserLayout>
    </div>
  )
}

export default ProfilePage
