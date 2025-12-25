import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest,getMyConnectionsRequests,sendConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
 

const viewProfilePage = ({userProfile}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const postReducer = useSelector((state) => state.postReducer)
    const authState = useSelector((state) => state.auth);
    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);
    

    const getUserPost = async () => {
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({token: localStorage.getItem("token")}));
      await dispatch(getMyConnectionsRequests({token: localStorage.getItem("token")}))
    }

    useEffect(() => {
//       let post = (postReducer?.posts ?? []).filter(post => 
//     post?.userId?.username === router?.query?.username
// );
let post = postReducer.posts.filter((post) => {
  return post?.userId?.username === router.query.userName
})


      setUserPosts(post);
    },[postReducer.posts])

    useEffect(() => {
      console.log(authState.connections, userProfile.userId?._id)
      if(authState.connections.some(user => user.connectionId?._id === userProfile.userId?._id)){
        setIsCurrentUserInConnection(true)
        if(authState.connections.find(user => user.connectionId?._id === userProfile.userId._id).status_accepted === true ){
          setIsConnectionNull(false)
        }
      }

      if(authState.connectionRequest.some(user => user.userId?._id === userProfile.userId?._id)){
        setIsCurrentUserInConnection(true)
        if(authState.connectionRequest.find(user => user.userId?._id === userProfile.userId._id).status_accepted === true ){
          setIsConnectionNull(false)
        }
      }


    }, [authState.connections, authState.connectionRequest])

    useEffect(() => {
      getUserPost();
    }, [])



  return (
    <UserLayout>
  <DashboardLayout>
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
        {userPosts.slice(0,1).map((post) => {
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
        {isCurrentUserInConnection ? 
          <button className={styles.btnPrimary}>{isConnectionNull ? "Pending": "Connected" }</button>:
          <button onClick={() => {
            dispatch(sendConnectionRequest({token : localStorage.getItem("token"), connectionId: userProfile.userId._id}))
          }} className={styles.btnPrimary}>Connect</button> 
        }

        <div onClick={() => {
    window.open(`${BASE_URL}/user/download_resume?id=${userProfile.userId._id}`, "_blank");
}} style={{cursor : "pointer"}}>
          <svg  style={{width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <p>Resume</p>
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
  </DashboardLayout>
</UserLayout>

  )
}

// export async function getServerSideProps(context) {
//   console.log("from view")
//   console.log(context.query.userName);
//   const request = await clientServer.get("/user/get_profile_based_on_username", {
//     params:{
//       username: context.query.userName
//     }
//   })

//   const response = await request.data
//   console.log(response)
//   return { props: {}}
// }

export async function getServerSideProps(context) {
  console.log("from view");

  const { username } = context.query; // MUST match [username].jsx filename
  console.log("Queried username:", username);

  
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        userName: username,  // backend expects userName=
      },
    });

    console.log("API response:", request.data);

    return {
      props: {
        userProfile: request.data.Profile, // backend returns { Profile: {...} }
      },
    };
  

    // return {
    //   props: {
    //     userProfile: null,
    //   },
    // };
  }




export default viewProfilePage
