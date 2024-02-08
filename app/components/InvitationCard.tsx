"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { DumpBox } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface InvitationCardProps{

    BoxData:DumpBox
}

const InvitationCard:React.FC<InvitationCardProps> = ({
    BoxData
}) => {

  const toast = useToast()
  const router = useRouter()

  const lastImageId =
    BoxData?.ImageIds && BoxData.ImageIds.length > 0
      ? BoxData.ImageIds[BoxData.ImageIds.length - 1]
      : null;

  const {data} = useSWR(`/api/getImage/${lastImageId}`,fetcher)

  const handleJoin = useCallback(async()=>{
    try {
      await axios.patch(`/api/joinBox/${BoxData?.id}`)
      toast({
        title: "Added To The DumpBox",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  },[BoxData?.id,router,toast])
  

  return (
    <div>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={
            data ||
            "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          }
          alt="Caffe Latte"
        />

        <Stack>
          <CardBody>
            <Heading size="md">{BoxData?.name}</Heading>

            <Text py="2"></Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" colorScheme="blue" onClick={()=>handleJoin()}>
              Join
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
}

export default InvitationCard
