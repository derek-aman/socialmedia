import Navbar from '@/Components/Navbar'
import React from 'react'

const UserLayout = ({children}) => {
  return (
    <div>
    <Navbar/>
    <main>{children}</main>
      
    </div>
  )
}

export default UserLayout
