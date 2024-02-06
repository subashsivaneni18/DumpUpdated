"use client"
import BoxIntro from '@/app/components/BoxIntro'
import ImageFeed from '@/app/components/ImageFeed'
import Navbar from '@/app/components/Navbar'
import fetcher from '@/libs/fetcher'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import useSWR from 'swr'

const Page = ({params}:{params:{boxId:string}}) => {

  const {status} = useSession()

  

  const {data:images=[]} = useSWR(`/api/AddData/${params.boxId}`,fetcher)
  const {data:dumpBoxData} = useSWR(`/api/dumpbox/${params.boxId}`,fetcher)

  if (status === "unauthenticated") {
    return redirect("/");
  }

  return (
    <div className="relative">
      <Navbar DumpBoxId={params.boxId} />
      <div className="absolute top-[120px] w-full mx-auto p-4">
        <BoxIntro data={dumpBoxData} imgs={images}  />
        <ImageFeed data={images} boxId={params.boxId}  />
      </div>
    </div>
  );
}

export default Page
