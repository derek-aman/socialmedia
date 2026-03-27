import UserLayout from '@/layout/UserLayout';
import React, { useEffect } from 'react'
import styles from './index.module.css'
import { clientServer } from '@/config';
import Image from 'next/image';
import DashboardLayout from '@/layout/DashboardLayout';
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionsRequests, sendConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

const ViewProfilePage = ({ userProfile }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer)
  const authState = useSelector((state) => state.auth);

  const userPosts = postReducer.posts.filter(
    (post) => post?.userId?.username === router.query.userName
  );

  const isCurrentUserInConnection =
    authState.connections.some(u => u.connectionId?._id === userProfile.userId?._id) ||
    authState.connectionRequest.some(u => u.userId?._id === userProfile.userId?._id);

  const isConnectionAccepted =
    authState.connections.find(u => u.connectionId?._id === userProfile.userId?._id)?.status_accepted ||
    authState.connectionRequest.find(u => u.userId?._id === userProfile.userId?._id)?.status_accepted;

  const isConnectionNull = !isConnectionAccepted;

  const getUserPost = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({ token }));
      await dispatch(getMyConnectionsRequests({ token }));
    }
  }, [dispatch]);

  useEffect(() => {
    getUserPost();
  }, [getUserPost]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>

          {/* ── COVER ── */}
          <div className={styles.coverSection}>
            <div className={styles.coverOverlay} />
            <Image
              className={styles.profileImage}
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="profile"
              width={500}
              height={300}
            />
          </div>

          {/* ── CONTENT ── */}
          <div className={styles.profileContent}>

            {/* Name + actions row */}
            <div className={styles.topRow}>
              <div>
                <h2 className={styles.name}>{userProfile?.userId?.name}</h2>
                <p className={styles.username}>@{userProfile?.userId?.userName}</p>
              </div>

              <div className={styles.actionRow}>
                {isCurrentUserInConnection ? (
                  <span className={`${styles.statusPill} ${isConnectionNull ? styles.statusPending : styles.statusConnected}`}>
                    {isConnectionNull ? 'Pending' : '✓ Connected'}
                  </span>
                ) : (
                  <button
                    className={styles.connectBtn}
                    onClick={() => dispatch(sendConnectionRequest({
                      token: localStorage.getItem("token"),
                      connectionId: userProfile.userId._id
                    }))}
                  >
                    Connect
                  </button>
                )}

                <button
                  className={styles.resumeBtn}
                  onClick={() => window.open(`${BASE_URL}/user/download_resume?id=${userProfile.userId._id}`, "_blank")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Resume
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              {[['128', 'Posts'], ['4.2K', 'Followers'], ['230', 'Following']].map(([val, label]) => (
                <div key={label} className={styles.statItem}>
                  <span className={styles.statValue}>{val}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            {userPosts.slice(0, 1).map((post) => (
              <div key={post._id} className={styles.recentPost}>
                <span className={styles.recentLabel}>Recent Activity</span>
                {post.media && (
                  <Image src={`${BASE_URL}/${post.media}`} alt='' width={50} height={30} className={styles.recentThumb} />
                )}
                <p className={styles.recentBody}>{post.body}</p>
              </div>
            ))}

            {/* Bio */}
            <div className={styles.infoCard}>
              <h4 className={styles.infoCard_title}>Bio</h4>
              <p className={styles.bioText}>
                {userProfile?.bio || 'No bio added yet.'}
              </p>
            </div>

            {/* Work history */}
            {userProfile.pastWork.length > 0 && (
              <div className={styles.infoCard}>
                <h4 className={styles.infoCard_title}>Work History</h4>
                <div className={styles.workGrid}>
                  {userProfile.pastWork.map((work, index) => (
                    <div key={index} className={styles.workChip}>
                      <span className={styles.workChip_company}>{work.company}</span>
                      <span className={styles.workChip_dot}>·</span>
                      <span className={styles.workChip_role}>{work.position}</span>
                      <span className={styles.workChip_years}>{work.years}y</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: { userName: username },
  });
  return { props: { userProfile: request.data.Profile } };
}

export default ViewProfilePage