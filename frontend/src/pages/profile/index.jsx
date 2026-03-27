import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import { BASE_URL } from '@/config';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';

const ProfilePage = () => {
  const authState = useSelector((state) => state.auth)
  const postReducer = useSelector((state) => state.postReducer)
  const [userProfile, setUserProfile] = useState(authState.user || null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts())
  }, [dispatch])

  if (authState.user && !userProfile) {
    setUserProfile(authState.user);
  }

  const userPosts = postReducer.posts.filter((post) =>
    post?.userId?.username === authState.user?.userName
  );

  const [inputData, setInputData] = useState({ company: '', position: '', years: '' });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  }

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    await clientServer.post("/update_profile_picture", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
  }

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId?.name,
    });
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }

  if (!authState.user || !userProfile?.userId) return null;

  return (
    <div>
      <UserLayout>
        <DashboardLayout>
          <div className={styles.container}>

            {/* ── COVER ── */}
            <div className={styles.coverSection}>
              <div className={styles.coverOverlay} />
              <div className={styles.profileImageWrapper}>
                <Image
                  className={styles.profileImage}
                  src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
                  alt="profile"
                  width={500}
                  height={300}
                />
                <label htmlFor="profilePictureUpload" className={styles.editOverlay}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </label>
                <input onChange={(e) => updateProfilePicture(e.target.files[0])} hidden type="file" id="profilePictureUpload" />
              </div>
            </div>

            {/* ── CONTENT ── */}
            <div className={styles.profileContent}>

              {/* Name + handle */}
              <div className={styles.nameSection}>
                <input
                  className={styles.nameEdit}
                  type="text"
                  value={userProfile?.userId?.name}
                  onChange={(e) => setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })}
                />
                <p className={styles.username}>@{userProfile?.userId?.userName}</p>
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
                    <Image src={`${BASE_URL}/${post.media}`} alt='' width={500} height={300} className={styles.recentThumb} />
                  )}
                  <p className={styles.recentBody}>{post.body}</p>
                </div>
              ))}

              {/* Download resume */}
              <button
                className={styles.resumeBtn}
                onClick={() => window.open(`${BASE_URL}/user/download_resume?id=${userProfile.userId._id}`, "_blank")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Resume
              </button>

              {/* Bio */}
              <div className={styles.infoCard}>
                <h4 className={styles.infoCard_title}>Bio</h4>
                <textarea
                  value={userProfile?.bio}
                  onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                  rows={Math.max(3, Math.ceil(userProfile?.bio?.length / 80))}
                  className={styles.bioTextarea}
                />
              </div>

              {/* Work history */}
              <div className={styles.infoCard}>
                <h4 className={styles.infoCard_title}>Work History</h4>
                <div className={styles.workGrid}>
                  {userProfile.pastWork.map((work, index) => (
                    <div key={`work-${index}`} className={styles.workChip}>
                      <span className={styles.workChip_company}>{work.company}</span>
                      <span className={styles.workChip_dot}>·</span>
                      <span className={styles.workChip_role}>{work.position}</span>
                      <span className={styles.workChip_years}>{work.years}y</span>
                    </div>
                  ))}
                </div>
                <button className={styles.addWorkBtn} onClick={() => setIsModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Work
                </button>
              </div>

              {/* Save */}
              {userProfile !== authState.user && (
                <button onClick={updateProfileData} className={styles.saveBtn}>
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* ── WORK MODAL ── */}
          {isModalOpen && (
            <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
              <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>Add Work Experience</h3>
                <input onChange={handleWorkInputChange} className={styles.modalInput} name='company' type="text" placeholder="Company name" />
                <input onChange={handleWorkInputChange} className={styles.modalInput} name='position' type="text" placeholder="Position / Role" />
                <input onChange={handleWorkInputChange} className={styles.modalInput} name='years' type="number" placeholder="Years" />
                <button
                  className={styles.saveBtn}
                  onClick={() => {
                    setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] });
                    setIsModalOpen(false);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    </div>
  )
}

export default ProfilePage