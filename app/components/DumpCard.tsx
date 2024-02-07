import fetcher from '@/libs/fetcher';
import {  Box, Button, Image, Text, useToast } from '@chakra-ui/react';
import { DumpBox } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'
import useSWR from 'swr';


interface DumpCardProps {
  DumpData:DumpBox
}
export const dynamic = "force-static";
const DumpCard:React.FC<DumpCardProps> = ({
  DumpData
}) => {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "",
    title: "Modern home in city center in the heart of historic Los Angeles",
  };

  const router = useRouter()
  const toast = useToast()

  const thumbnail = DumpData.ImageIds.findLast(x=>x) || ""
  
  const {data:imgUrl } = useSWR(`/api/getImage/${thumbnail}`,fetcher)

  const handleDelete = useCallback(async(id:string)=>{
    try {
      await axios.delete(`/api/DelDump/${id}`)
       toast({
         title: "Deleted Sucessfully",
         description: "We've created your account for you.",
         status: "success",
         duration: 9000,
         isClosable: true,
       });
       router.push('/Dashboard')
    } catch (error) {
      console.log(error)
       toast({
         title: "Something Went Wrong",
         status: "error",
         duration: 9000,
         isClosable: true,
       });
    }
  },[router,toast])



  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/Dumpbox/${DumpData.id}`)}
    >
      <Box maxW="xs" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image
          src={imgUrl ? imgUrl : ""}
          alt={property.imageAlt}
          className="hover:scale-105 transition"
        />

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            ></Box>
          </Box>

          <div className='flex justify-between gap-3 items-center'>
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              noOfLines={1}
              className="flex justify-between"
            >
              <Text className="text-xl" fontWeight="light">
                {DumpData.name}
              </Text>
            </Box>

            <Button size='sm' colorScheme='red' onClick={()=>handleDelete(DumpData.id)}>Delete</Button>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default DumpCard
