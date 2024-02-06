"use client"
import { Box, Button, Image } from '@chakra-ui/react';
import { DumpBox, Image as PrismaImage } from '@prisma/client';
import React, { useState } from 'react'
import BoxMenu from './BoxMenu';

interface BoxIntroProps {
  data: DumpBox;
  imgs:PrismaImage[]
}

const BoxIntro:React.FC<BoxIntroProps> = ({
  data,
  imgs
}) => {

  const thubnail = imgs?.[imgs?.length-1]?.url || ""



  return (
    <div>
      <div className="py-3 flex items-center gap-4">
        <Box
          w="100%"
          p={4}
          color="black"
          className="flex items-center gap-[40px]"
        >
          <Box w="20%">
            <Image
              src={thubnail}
              alt="Dan Abramov"
              className="rounded-2xl  transition-all w-fit h-fit cursor-pointer"
            />
          </Box>

          <Box className="">
            <p className="text-3xl">{data?.name}</p>
            <div className="flex items-center gap-3">
              <p>{data?.ImageIds?.length}</p>
              <p>Photos</p>
            </div>
          </Box>
        </Box>

        <Box>
          <div className="cursor-pointer">
            <BoxMenu boxId={data?.id} />
          </div>
        </Box>

        {/* <Box>
          <Button colorScheme="red">Delete</Button>
        </Box> */}
      </div>


      {/* <div className='p-4 pb-10'>
        Items Selected
      </div> */}
    </div>
  );
}

export default BoxIntro
