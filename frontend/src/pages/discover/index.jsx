import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config';
import Image from 'next/image';
import styles from './indexx.module.css'
import { useRouter } from 'next/router'

const DiscoverPage = () => {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.page}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Discover</h1>
            <p className={styles.pageSubtitle}>Find people worth connecting with</p>
          </div>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.all_users.map((user, i) => (
              <div
                onClick={() => router.push(`/view_profile/${user.userId?.userName}`)}
                key={user._id}
                className={styles.userCard}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={styles.avatarWrapper}>
                  <Image
                    className={styles.userCard_image}
                    src={`${BASE_URL}/${user.userId?.profilePicture}`}
                    alt="profile"
                    width={500}
                    height={300}
                  />
                  <div className={styles.onlineDot} />
                </div>
                <div className={styles.userCard_info}>
                  <h3>{user.userId?.name}</h3>
                  <p className={styles.userName}>@{user.userId?.userName}</p>
                </div>
                <div className={styles.arrowIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default DiscoverPage