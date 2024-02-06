"use client"
import React, { useCallback } from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon,  GripVertical } from 'lucide-react';
import getURL from '@/libs/getUrl';
import { usePathname, useRouter } from 'next/navigation';
import fetcher from '@/libs/fetcher';
import useSWR from 'swr';
import { User } from '@prisma/client';
import axios from 'axios';
import { UploadButton } from '@/libs/uploadthing';
import Link from 'next/link';

interface BoxMenuProps{
  boxId:string
}

const BoxMenu:React.FC<BoxMenuProps> = ({
  boxId
}) => {

  const pathaname = usePathname();
  const toast = useToast()
  const router = useRouter()

  const { data: currentUser } = useSWR<User>(
    `/api/currentUser/${boxId}`,
    fetcher
  );

  const { mutate: mutateImages } = useSWR(`/api/AddData/${boxId}`, fetcher);
  const { mutate: mutateDumpBox } = useSWR(
    `/api/dumpbox/${boxId}`,
    fetcher
  );

  const handleInviteLink = () =>{
    const url = getURL("")+"invite/"+boxId
    navigator.clipboard.writeText(url).then(()=>{
      toast({
        title: "Link Coppied",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    })
  }

  const handleUploading = useCallback(
    async (urls: string[]) => {
      try {
        if (urls.length > 0) {
          await axios.post(`/api/AddData/${boxId}`, urls);
          mutateImages();
          mutateDumpBox();
          toast({
            title: "Created",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } else {
          // Handle the case when there is no data to upload
          toast({
            title: "No Data",
            description: "No images to upload",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
    [boxId, toast, mutateImages, mutateDumpBox]
  );

  return (
    <div className="flex gap-5 items-center">
      {currentUser?.isAdmin && (
        <Menu colorScheme="white">
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <GripVertical />
          </MenuButton>
          <MenuList className="w-[50px]" width="50px">
            <MenuItem onClick={() => handleInviteLink()}>
              Invite A Member
            </MenuItem>
            <MenuItem onClick={() => router.push(`/acessControll/${boxId}`)}>
              Access Controll
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {currentUser?.isAdmin && (
        <div>
          <UploadButton
            endpoint="DumpBoxImages"
            onClientUploadComplete={async (res) => {
              const urls = await Promise.all(res.map((item) => item.url));
              if (urls.length > 0) {
                await handleUploading(urls);
              }
            }}
          />
        </div>
      )}

      <div>
        <Link href={`/slideShow/${boxId}`}>
          <Button>SlideShow</Button>
        </Link>
      </div>
    </div>
  );
}

export default BoxMenu
