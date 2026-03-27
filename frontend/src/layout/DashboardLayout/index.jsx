import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';

const NAV_ITEMS = [
  {
    label: 'Scroll',
    route: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Discover',
    route: '/discover',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    label: 'Connections',
    route: '/my_connections',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      router.push('/login');
    }
    dispatch(setTokenIsThere());
  });

  useEffect(() => {
    setActiveRoute(router.pathname);
  }, [router.pathname]);

  const navigate = (route) => {
    setActiveRoute(route);
    router.push(route);
  };

  return (
    <div className={styles.root}>
      {/* Grain overlay */}
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.shell}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className={styles.sidebar}>
          {/* Logo / wordmark */}
          <div className={styles.logoBlock}>
            <span className={styles.logoDot} />
            <span className={styles.logoText}>nexus</span>
          </div>

          {/* Nav */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`${styles.navItem} ${activeRoute === item.route ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {activeRoute === item.route && <span className={styles.navPip} />}
              </button>
            ))}
          </nav>

          {/* Profile chip at bottom */}
          <button
            className={styles.profileChip}
            onClick={() => navigate('/profile')}
          >
            <span className={styles.avatarRing}>
              <span className={styles.avatarInner} />
            </span>
            <span className={styles.profileChipLabel}>My Profile</span>
            <svg className={styles.profileChipArrow} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className={styles.feed}>
          {children}
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className={styles.rightPanel}>
          <div className={styles.rightPanelHeader}>
            <span className={styles.rightPanelTitle}>Top Profiles</span>
            <span className={styles.rightPanelBadge}>
              {authState.all_users?.length || 0}
            </span>
          </div>

          <div className={styles.profileList}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((profile, i) => (
                <div
                  key={profile._id}
                  className={styles.profileCard}
                  onClick={() => navigate(`/view_profile/${profile.userId?.username}`)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={styles.profileCardAvatar}>
                    {profile.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.profileCardInfo}>
                    <span className={styles.profileCardName}>{profile.userId?.name}</span>
                    <span className={styles.profileCardHandle}>@{profile.userId?.username}</span>
                  </div>
                  <svg className={styles.profileCardArrow} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              ))}
          </div>
        </aside>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className={styles.mobileNav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={`${styles.mobileNavBtn} ${activeRoute === item.route ? styles.mobileNavBtnActive : ''}`}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;