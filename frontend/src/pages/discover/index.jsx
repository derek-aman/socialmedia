import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config';
import styles from './indexx.module.css'



const DiscoverPage = () => {
    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    useEffect(() => {
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers());
        }
    }, [])
    
  return (
    <UserLayout>
        <DashboardLayout>
            <div>
                <h1>Discover Page</h1>
                <div className={styles.allUserProfile}>
                    {authState.all_profiles_fetched && authState.all_users.map((user) => {
                        return(
                            <div key={user._id} className={styles.userCard}>
                                <img  className={styles.userCard_image} src={`${BASE_URL}/${user.userId?.profilePicture}`} alt="profile" />
                                <div>
                                <h3>{user.userId?.name}</h3>
                                <p className={styles.userName}>{user.userId?.userName}</p>
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
