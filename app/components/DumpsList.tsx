import fetcher from '@/libs/fetcher'
import { DumpBox, User } from '@prisma/client'
import React from 'react'
import useSWR from 'swr'
import DumpItem from './DumpItem'

const DumpsList = () => {

    const {data:dumps=[]} = useSWR<DumpBox[]>('/api/dumps',fetcher)
    const {data:currentUser} = useSWR<User>(`/api/current`,fetcher)

  return (
    <div className='flex flex-col gap-2'>
      {dumps?.map((dump:DumpBox)=>(
        <div key={dump.id}>
            <DumpItem currentUserId={currentUser?.id!!} id={dump.id}/>
        </div>
      ))}
    </div>
  )
}

export default DumpsList
