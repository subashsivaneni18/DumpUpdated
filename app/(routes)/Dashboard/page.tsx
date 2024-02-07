"use client"

import DumpCard from "@/app/components/DumpCard"
import Navbar from "@/app/components/Navbar"
import fetcher from "@/libs/fetcher"
import { DumpBox } from "@prisma/client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import useSWR from "swr"

export const dynamic = "force-static";

const Page = () => {


  const {status} = useSession()
  

  const {data:currentUserDupms=[]} = useSWR<DumpBox[]>('/api/dumps',fetcher)

  if (status === "unauthenticated") {
    return redirect("/");
  }

  if(status==='loading')
  {
    return <p>Loading</p>
  }
    
  return (
    <div className="relative">
      <Navbar />
      <div className=" absolute top-[100px] left-20 overflow-x-hidden  w-full mx-auto">
        <div className="w-full grid grid-cols-3 mx-auto gap-y-5 gap-x-4">
          {currentUserDupms?.map((DumpData: DumpBox) => (
            <div key={DumpData.id}>
              <DumpCard DumpData={DumpData} />
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}

export default Page
