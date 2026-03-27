import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

const Navbar = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <button className={styles.logo} onClick={() => router.push("/")}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>nexus</span>
        </button>

        <div className={styles.actions}>
          {authState.profileFetched ? (
            <>
              <span className={styles.greeting}>Hey, {authState.user.userId?.name}</span>
              <button onClick={() => router.push("/profile")} className={styles.navBtn}>Profile</button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                className={styles.navBtnGhost}
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => router.push("/login")} className={styles.joinBtn}>
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar