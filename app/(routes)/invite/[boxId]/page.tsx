"use client"
import InvitationCard from '@/app/components/InvitationCard'
import Navbar from '@/app/components/Navbar'
import fetcher from '@/libs/fetcher'
import { useSession } from 'next-auth/react'
import { DumpBox } from '@prisma/client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const Page = ({params}:{params:{boxId:string}}) => {

  const {status} = useSession()

  const [boxId,setBoxId] = useState('')

  useEffect(()=>{
    setBoxId(params.boxId)
  },[setBoxId,params.boxId])

  console.log(boxId)

  const {data} = useSWR<DumpBox>(`/api/dumpbox/${boxId}`,fetcher)

  if (status === "unauthenticated") {
    return redirect(`/invite/login/${params.boxId}`);
  }


  return (
    <div className="relative">
      <Navbar />
      <div className="absolute top-[70px] ">
        <div className="w-screen h-screen flex items-center justify-center">
          <InvitationCard  BoxData={data!!} />
        </div>
      </div>
    </div>
  );
}

export default Page
