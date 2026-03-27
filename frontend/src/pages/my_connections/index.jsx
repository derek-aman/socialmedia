import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionsRequests } from '@/config/redux/action/authAction'
import styles from './index.module.css'
import Image from 'next/image';
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

const MyConnectionsPage = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionsRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  const pending = authState.connectionRequest.filter(c => c.status_accepted === null);
  const network = authState.connectionRequest.filter(c => c.status_accepted !== null);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.page}>

          {/* ── PENDING ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Pending Requests</h2>
              {pending.length > 0 && (
                <span className={styles.badge}>{pending.length}</span>
              )}
            </div>

            {pending.length === 0 ? (
              <div className={styles.emptyState}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <p>No pending requests</p>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {pending.map((user, i) => (
                  <div
                    key={i}
                    className={styles.userCard}
                    onClick={() => router.push(`/view_profile/${user.userId?.userName}`)}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Image
                      className={styles.avatar}
                      src={`${BASE_URL}/${user.userId?.profilePicture}`}
                      alt="profile"
                      width={500}
                      height={300}
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user.userId?.name}</span>
                      <span className={styles.userHandle}>@{user.userId?.userName}</span>
                    </div>
                    <button
                      className={styles.acceptBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(AcceptConnection({
                          connectionId: user._id,
                          token: localStorage.getItem("token"),
                          action: "accept",
                        }));
                      }}
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── NETWORK ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>My Network</h2>
              {network.length > 0 && (
                <span className={styles.badge}>{network.length}</span>
              )}
            </div>

            {network.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No connections yet — go discover people!</p>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {network.map((user, i) => (
                  <div
                    key={i}
                    className={styles.userCard}
                    onClick={() => router.push(`/view_profile/${user.userId?.userName}`)}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Image
                      className={styles.avatar}
                      src={`${BASE_URL}/${user.userId?.profilePicture}`}
                      alt="profile"
                      width={500}
                      height={300}
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user.userId?.name}</span>
                      <span className={styles.userHandle}>@{user.userId?.userName}</span>
                    </div>
                    <span className={styles.connectedPill}>Connected</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage