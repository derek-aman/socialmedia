import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

const Login = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmailAdress] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (authState.loggedIn) router.push('/dashboard');
  }, [authState.loggedIn, router]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  return (
    <UserLayout>
      <div className={styles.container}>
        {/* background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        <div className={styles.card}>
          {/* ── LEFT FORM ── */}
          <div className={styles.formSide}>
            <div className={styles.formHeader}>
              <span className={styles.logoDot} />
              <span className={styles.logoText}>nexus</span>
            </div>

            <h1 className={styles.heading}>
              {userLoginMethod ? 'Welcome back.' : 'Join the network.'}
            </h1>
            <p className={styles.subheading}>
              {userLoginMethod ? 'Sign in to continue.' : 'Create your account today.'}
            </p>

            {authState.message?.message && (
              <div className={`${styles.statusMsg} ${authState.isError ? styles.error : styles.success}`}>
                {authState.message.message}
              </div>
            )}

            <div className={styles.fields}>
              {!userLoginMethod && (
                <div className={styles.fieldRow}>
                  <input onChange={(e) => setUserName(e.target.value)} className={styles.input} type="text" placeholder="Username" />
                  <input onChange={(e) => setName(e.target.value)} className={styles.input} type="text" placeholder="Full Name" />
                </div>
              )}
              <input onChange={(e) => setEmailAdress(e.target.value)} className={styles.input} type="text" placeholder="Email address" />
              <input onChange={(e) => setPassword(e.target.value)} className={styles.input} type="password" placeholder="Password" />
              <button
                className={styles.mainBtn}
                onClick={() => userLoginMethod
                  ? dispatch(loginUser({ email, password }))
                  : dispatch(registerUser({ userName, email, password, name }))
                }
              >
                {userLoginMethod ? 'Sign In' : 'Create Account'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className={styles.accentSide}>
            <div className={styles.accentContent}>
              <p className={styles.accentQuote}>
                {userLoginMethod ? "New here?" : "Already one of us?"}
              </p>
              <p className={styles.accentSub}>
                {userLoginMethod
                  ? "Create an account and start building your network."
                  : "Sign in and pick up where you left off."}
              </p>
              <button onClick={() => setUserLoginMethod(!userLoginMethod)} className={styles.switchBtn}>
                {userLoginMethod ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Login;