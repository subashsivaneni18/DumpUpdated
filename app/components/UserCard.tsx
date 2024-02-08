"use client"
import React, { useCallback, useEffect } from 'react'
import { Card,  CardBody, CardFooter,  Avatar, Badge, List, ListItem, useToast } from "@chakra-ui/react";
import { User } from '@prisma/client';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { redirect, useRouter } from 'next/navigation';


interface UserCardProps{
    user:User
    boxId:string
}

const UserCard:React.FC<UserCardProps> = ({
    user,
    boxId
}) => {

  const toast = useToast()
  const router = useRouter()

  const {mutate:mutateBox} = useSWR(`/api/dumpbox/${boxId}`,fetcher)
  const { data:currentUser } = useSWR<User>("/api/currentUser", fetcher);
  const { data: users,mutate:mutateUsers } = useSWR<User[]>(
    `/api/getUsersofDump/${boxId}`,
    fetcher
  );
  const {data:AdminIds} = useSWR<string []>(`/api/AdminIds/${boxId}`,fetcher)

  const handleDelete = useCallback(async()=>{
    try {
      await axios.patch(`/api/acess/${boxId}`,{id:user.id})
      toast({
        title: "Deleted Sucessfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      mutateBox()
      mutateUsers()
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed to delete",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  },[toast,boxId,user?.id,mutateBox,mutateUsers])


  const handleAcessChange = useCallback(async()=>{
      try {
        await axios.patch(`/api/AdminControl/${boxId}`,{userId:user?.id})
        toast({
          title: "Acess Changed Sucessfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        mutateBox()
        mutateUsers()
        router.refresh()
      } catch (error) {
        console.log(error)
      }
  },[toast,boxId,user?.id,mutateBox,mutateUsers,router])

  const {data:parentId} = useSWR(`/api/parent/${boxId}`,fetcher)


  
  useEffect(()=>{
     if(!AdminIds?.includes(currentUser?.id as string))
     {
      router.push('/')
     }
  },[])

  

  return (
    <div>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        size="xs"
        className="p-3 flex gap-16 items-center w-[500px] h-fit -space-y-2 rounded-xl"
      >
        <Avatar
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={user.image || "./images/noAva.jpg"}
          size="lg"
        />

        <div className=" space-y-4 flex items-center gap-5">
          <CardBody>
            <p className="text-lg">{user?.username}</p>
          </CardBody>

          <CardFooter className="flex gap-3">
            {user.isAdmin ? (
              <div>
                <Badge colorScheme="green">Admin</Badge>
              </div>
            ) : (
              <div>
                <Badge>Member</Badge>
              </div>
            )}
          </CardFooter>
        </div>

        {user.isAdmin === true && user.id == parentId ? (
          <div></div>
        ) : (
          <div>
           {!(currentUser?.id===user.id) && <p className="cursor-pointer" onClick={() => handleDelete()}>
              Delete User
            </p>}
            { <p className="cursor-pointer" onClick={() => handleAcessChange()}>
              Change Acess
            </p>}
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserCard
