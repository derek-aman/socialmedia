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
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ userName, email, password, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {/* Left Side */}
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? 'Welcome Back ' : 'Create Your Account '}
            </p>

            {authState.message?.message && (
              <p
                className={`${styles.statusMessage} ${
                  authState.isError ? styles.error : styles.success
                }`}
              >
                {authState.message.message}
              </p>
            )}

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Full Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAdress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              <button
                onClick={() =>
                  userLoginMethod ? handleLogin() : handleRegister()
                }
                className={styles.mainButton}
              >
                {userLoginMethod ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className={styles.cardContainer_right}>
            <p className={styles.switchText}>
              {userLoginMethod
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <button
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              className={styles.switchButton}
            >
              {userLoginMethod ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Login;
