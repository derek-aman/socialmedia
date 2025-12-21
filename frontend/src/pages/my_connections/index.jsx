import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionsRequests  } from '@/config/redux/action/authAction'
import styles from './index.module.css'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'


const MyConnectionsPage = () => {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionsRequests({token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest)
    }
  }, [authState.connectionRequest]);



  return (
    <UserLayout>
        <DashboardLayout>
            <div style={{display: "flex", flexDirection: "column", gap: "1.7rem" }}>
                <h4>My connections</h4>
                {authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1>}
                {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user , index)=> {
                  return(
                    <div onClick={() => {
                      router.push(`/view_profile/${user.userId?.userName}`)
                    }} key={index} className={styles.userCard}>
                      <div style={{display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-around"}}>
                        <div className={styles.profilePicture}>
                         <img  className={styles.userCard_image} src={`${BASE_URL}/${user.userId?.profilePicture}`} alt="profile" />
                        </div>
                        <div className={styles.userInfo}>
                           <h3>{user.userId.name}</h3>
                           <p>{user.userId.userName}</p>
                        </div>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            dispatch(AcceptConnection({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            }))
                           }} className={styles.btnPrimary}>Accept</button> 
                      </div> 
                      

                          
                    </div>
                    
                  )
                })}

                <h4>My Network</h4>
                {
                  authState.connectionRequest.length !== 0 &&
                  authState.connectionRequest
                    .filter((connection) => connection.status_accepted != null)
                    .map((user, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                          
                        }}
                      >
                        <div className={styles.profilePicture}>
                          <img
                            className={styles.userCard_image}
                            src={`${BASE_URL}/${user.userId?.profilePicture}`}
                            alt="profile"
                          />
                        </div>

                        <div className={styles.userInfo}>
                          <h3>{user.userId?.name}</h3>
                          <p>{user.userId?.userName}</p>
                        </div>
                      </div>
                    ))
                }

                           
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage
