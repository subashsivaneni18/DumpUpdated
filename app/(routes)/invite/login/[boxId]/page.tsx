"use client"
import BoxMenu from '@/app/components/BoxMenu'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import RegisterModal from '@/app/components/RegisterModal';
import InviteLoginModal from '@/app/components/InviteLoginModal';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Page = ({params}:{params:{boxId:string}}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {status} = useSession()

  if(status==='authenticated')
  {
    redirect(`/invite/${params.boxId}`)
  }

  return (
    <div className="relative">
      <Navbar />
      <div className="absolute top-[100px] w-[100vw] h-[80vh] flex justify-center items-center gap-40">
        <InviteLoginModal/>
        <RegisterModal isInvitation />
      </div>
    </div>
  );
}

export default Page
