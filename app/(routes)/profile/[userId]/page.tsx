"use client"
import DumpsList from '@/app/components/DumpsList'
import Navbar from '@/app/components/Navbar'
import fetcher from '@/libs/fetcher'
import { Avatar, Button } from '@chakra-ui/react'
import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'





const Profile = ({params}:{params:{userId:string}}) => {

    

    
    

   const {data:currentUser} = useSWR('/api/current')
    

  return (
    <div className="relative">
      <Navbar />
      <div className="absolute top-[90px] p-4 ">
        <div className='flex w-full h-full justify-center gap-10'>

          <div className="w-[30vw] h-[50vh] border flex items-center justify-center relative ">
            <Avatar size="xxl" className="cursor-pointer" src={currentUser?.image || ""} />
            <Button colorScheme='messenger' className='absolute top-36'>Edit</Button>
          </div>

          <div className="w-[60vw] h-screen border">
            <DumpsList/>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile
