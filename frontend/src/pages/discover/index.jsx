import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'

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
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default DiscoverPage
