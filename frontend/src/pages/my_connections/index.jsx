import React from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'

const MyConnectionsPage = () => {
  return (
    <UserLayout>
        <DashboardLayout>
            <div>
                <h1>My connections</h1>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage
