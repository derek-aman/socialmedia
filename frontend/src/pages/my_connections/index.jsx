import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionsRequests  } from '@/config/redux/action/authAction'
import styles from './index.module.css'
import Image from 'next/image';
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'


const MyConnectionsPage = () => {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionsRequests({token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest)
    }
  }, [authState.connectionRequest]);



  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.pageWrapper}>

  
  <section>
    <h4 className={styles.sectionTitle}>Pending Requests</h4>

    {authState.connectionRequest.length === 0 && (
      <p className={styles.emptyText}>No Connection Request Pending</p>
    )}

    <div className={styles.cardGrid}>
      {authState.connectionRequest
        .filter((c) => c.status_accepted === null)
        .map((user, index) => (
          <div
            key={index}
            className={styles.userCard}
            onClick={() =>
              router.push(`/view_profile/${user.userId?.userName}`)
            }
          >
            <Image
              className={styles.avatar}
              src={`${BASE_URL}/${user.userId?.profilePicture}`}
              alt="profile" width={500} // Actual width or aspect ratio base
  height={300}
            />

            <div className={styles.userInfo}>
              <h3>{user.userId?.name}</h3>
              <p>@{user.userId?.userName}</p>
            </div>

            <button
              className={styles.btnPrimary}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  AcceptConnection({
                    connectionId: user._id,
                    token: localStorage.getItem("token"),
                    action: "accept",
                  })
                );
              }}
            >
              Accept
            </button>
          </div>
        ))}
    </div>
  </section>

  
  <section>
    <h4 className={styles.sectionTitle}>My Network</h4>

    <div className={styles.cardGrid}>
      {authState.connectionRequest
        .filter((c) => c.status_accepted !== null)
        .map((user, index) => (
          <div
            key={index}
            className={styles.userCard}
            onClick={() =>
              router.push(`/view_profile/${user.userId?.userName}`)
            }
          >
            <Image
              className={styles.avatar}
              src={`${BASE_URL}/${user.userId?.profilePicture}`}
              alt="profile" width={500} // Actual width or aspect ratio base
  height={300}
            />

            <div className={styles.userInfo}>
              <h3>{user.userId?.name}</h3>
              <p>@{user.userId?.userName}</p>
            </div>
          </div>
        ))}
    </div>
  </section>
</div>

        </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage
