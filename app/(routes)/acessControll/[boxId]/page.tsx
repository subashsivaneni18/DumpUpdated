"use client"
import Navbar from '@/app/components/Navbar'
import UserCard from '@/app/components/UserCard'
import fetcher from '@/libs/fetcher'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

export const dynamic = "force-dynamic";

const AcessControllPage = ({params}:{params:{boxId:string}}) => {

    const {data:users} = useSWR<User[]>(`/api/getUsersofDump/${params.boxId}`,fetcher)

    const session = useSession()

    if(!session)
    {
        return redirect('/')
    }
    

    return(
        <div className='relative'>
            <Navbar/>
            <div className='absolute top-[100px] flex justify-center w-full'>
                <div className='w-[80vw] border flex justify-center flex-col items-center gap-y-3 h-full'>
                   {users?.map((user)=>(
                    <UserCard user={user} key={user.id} boxId={params.boxId} />
                   ))}
                </div>
            </div>
        </div>
    )
}

export default AcessControllPage
