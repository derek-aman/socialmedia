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
    useEffect(() => {
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers());
        }
    }, [authState.all_profiles_fetched,dispatch])

    const router = useRouter();
    
  return (
    <UserLayout>
    <DashboardLayout>
        
            <div>
                <h1>Discover Page</h1>
                <div className={styles.allUserProfile}>
                    {authState.all_profiles_fetched && authState.all_users.map((user) => {
                        return(
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId?.userName}`)
                            }} key={user._id} className={styles.userCard}>
                                <Image  className={styles.userCard_image} src={`${BASE_URL}/${user.userId?.profilePicture}`} alt="profile" width={500} // Actual width or aspect ratio base
  height={300} />
                                <div>
                                <h3>{user.userId?.name}</h3>
                                <p className={styles.userName}>@{user.userId?.userName}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            </DashboardLayout>
        
    </UserLayout>
  )
}

export default DiscoverPage
