import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect , useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './style.module.css'

const Login = () => {

    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const [userLoginMethod, setUserLoginMethod] = useState(false);

    useEffect(() => {
        if(authState.loggedIn){
            router.push("/dashboard")
        }
    })


  return (
    <UserLayout>
      <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
            <div className={styles.inputContainers}>
                <div className={styles.inputRow}>
                    <input className={styles.inputField} type="text"  placeholder='Username'/>
                    <input className={styles.inputField} type="text"  placeholder='Name'/>
                </div>
                    <input className={styles.inputField} type="text"  placeholder='Password'/>

                
            </div>

      </div>
      <div className={styles.cardContainer_right}>
        
      </div>
      </div>
      </div>
    </UserLayout>
  )
}

export default Login
