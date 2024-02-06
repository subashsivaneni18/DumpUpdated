"use client"
import { User, Image as prismaImage } from '@prisma/client'
import {  Button, Grid,  Image, useToast  } from "@chakra-ui/react";
import React, { useCallback, useState } from 'react'
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import ImageViewer from './ImageViewer';
import { useRouter } from 'next/navigation';

interface ImageFeedProps{
    data:Array<prismaImage>
    boxId:string
}

const ImageFeed:React.FC<ImageFeedProps> = ({
    data,
    boxId
}) => {

  const [selectedIds,setSelectesIds] = useState<String[]>([])
  const [isButtonSelected,setIsButtonSelected] = useState<Boolean>(true)
  const [viewSelected,setViewSelected] = useState<Boolean>(false)

  const { data: currentUser } = useSWR<User>(
    `/api/currentUser/${boxId}`,
    fetcher
  );
  const toast = useToast()
  const router = useRouter()


  const { mutate: mutateImages } = useSWR(`/api/AddData/${boxId}`, fetcher);

  const handleSelect = useCallback(
    (id: string) => {
      if(!isButtonSelected)
      {
        try {
          setSelectesIds((prevIds) => {
            if (prevIds.includes(id)) {
              // If the id is already in the array, remove it
              return prevIds.filter((i) => i !== id);
            } else {
              // If the id is not in the array, add it
              return [...prevIds, id];
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
      else
      { 
        console.log("hello")
      }
    },
    [setSelectesIds,isButtonSelected]
  );

  const handeDelete = useCallback(async() => {
    try {
      console.log(selectedIds)
      await axios.delete(`/api/DeletePics/${boxId}`,{data:selectedIds})
       toast({
         title: "Deleted Sucessfully ",
         status: "success",
         duration: 9000,
         isClosable: true,
       });
       setSelectesIds([])
       mutateImages()
       router.refresh()
    } catch (error) {
      console.log(error)
       toast({
         title: "Something went wrong",
         status: "error",
         duration: 9000,
         isClosable: true,
       });
    }
  }, [selectedIds,boxId,mutateImages,toast,router]);

  


  return (
    <>
      {currentUser?.isAdmin && (
        <div className="flex justify-between items-center mb-3 p-4">
          <p>Pics Selected : {selectedIds.length}</p>

          <div className="flex gap-4 ">
            <Button
              colorScheme="telegram"
              onClick={() => setIsButtonSelected((x) => !x)}
            >
              {isButtonSelected
                ? "start selecting pics"
                : `Stop Selecting Pics`}
            </Button>

            <Button colorScheme="red" onClick={() => handeDelete()}>
              Delete
            </Button>
          </div>
        </div>
      )}
      {/* <Grid
        templateColumns="repeat(3, 1fr)"
        gap={3}
        className="relative w-full h-full flex flex-col justify-center"
      >
        {data?.map((i: prismaImage) => (
          <div key={i.id} className="relative">
            <Image
              src={i.url}
              alt="Dan Abramov"
              className={`
                rounded-2xl hover:scale-110 transition-all w-fit h-fit cursor-pointer
                ${selectedIds.includes(i.id) ? "bg-black" : ""}
              `}
              onClick={() => handleSelect(i.id)}
            />

            {selectedIds.includes(i.id) && (
              <div
                onClick={() => handleSelect(i.id)}
                className="absolute w-full h-full bg-black/40 top-0 rounded-2xl  transition-all  cursor-pointer"
              ></div>
            )}
          </div>
        ))}
      </Grid> */}
      
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={3}
        className="relative w-full h-full flex flex-col justify-center"
      >
        {Array.isArray(data) && data.length > 0 ? (
          data.map((i: prismaImage) => (
            <div key={i.id} className="relative">
              <Image
                src={i.url}
                alt="Dan Abramov"
                className={`
            rounded-2xl hover:scale-110 transition-all w-fit h-fit cursor-pointer
            ${selectedIds.includes(i.id) ? "bg-black" : ""}
          `}
                onClick={() => handleSelect(i.id)}
              />

              {selectedIds.includes(i.id) && (
                <div
                  onClick={() => handleSelect(i.id)}
                  className="absolute w-full h-full bg-black/40 top-0 rounded-2xl  transition-all  cursor-pointer"
                ></div>
              )}
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </Grid>
      
    </>
  );
}

export default ImageFeed
