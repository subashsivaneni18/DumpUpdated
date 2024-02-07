"use client"
import fetcher from '@/libs/fetcher'
import { Button } from '@chakra-ui/react'
import { DumpBox } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

interface DumpItemProps{
    id:string
    currentUserId:string
}

const DumpItem:React.FC<DumpItemProps> = ({
    currentUserId,
    id
}) => {

    const {data:parentId} = useSWR(`/api/parent/${id}`,fetcher)
    const {data:DumpData} = useSWR<DumpBox>(`/api/dumpbox/${id}`,fetcher)

    const router = useRouter()

  return (
    <div className="px-5 py-4 flex gap-3 items-center border ">
      <p
        className="cursor-pointer text-xl"
        onClick={() => router.push(`/Dumpbox/${id}`)}
      >
        {DumpData?.name}
      </p>
      {parentId === currentUserId && (
        <div>
          <Button  size='sm'>Delete</Button>
        </div>
      )}
    </div>
  );
}

export default DumpItem
