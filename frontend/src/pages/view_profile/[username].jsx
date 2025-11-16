import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import Dashboard from '../dashboard';
import { clientServer } from '@/config';

const viewProfilePage = (userProfile) => {

    const searchParams = useSearchParams();
  useEffect(() => {
    console.log("fom view: view profile");

  })    
  return (
    <UserLayout>
      <Dashboard>
        <div>{userProfile.userId?.name}</div>
      </Dashboard>
    </UserLayout>
  )
}

// export async function getServerSideProps(context) {
//   console.log("from view")
//   console.log(context.query.userName);
//   const request = await clientServer.get("/user/get_profile_based_on_username", {
//     params:{
//       username: context.query.userName
//     }
//   })

//   const response = await request.data
//   console.log(response)
//   return { props: {}}
// }

export async function getServerSideProps(context) {
  console.log("from view");

  const { username } = context.query; // MUST match [username].jsx filename
  console.log("Queried username:", username);

  
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        userName: username,  // backend expects userName=
      },
    });

    console.log("API response:", request.data);

    return {
      props: {
        userProfile: request.data.Profile, // backend returns { Profile: {...} }
      },
    };
  

    return {
      props: {
        userProfile: null,
      },
    };
  }




export default viewProfilePage
