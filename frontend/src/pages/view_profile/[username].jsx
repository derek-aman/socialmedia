import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest,sendConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
 

const viewProfilePage = ({userProfile}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const postReducer = useSelector((state) => state.postReducer)
    const authState = useSelector((state) => state.auth);
    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    

    const getUserPost = async () => {
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({token: localStorage.getItem("token")}));
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
      }


    }, [authState.connections])

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

        {isCurrentUserInConnection ? 
          <button className={styles.btnPrimary}>Connected</button>:
          <button onClick={() => {
            dispatch(sendConnectionRequest({token : localStorage.getItem("token"), user_id: userProfile.userId._id}))
          }} className={styles.btnPrimary}>Connect</button> 
        }

        {/* BIO SECTION */}
        <div className={styles.bioBox}>
          <h4>Bio</h4>
          <p>
            {userProfile?.bio ||
              "No bio added yet. This space can contain user’s introduction, skills, hobbies or profession."}
          </p>
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
