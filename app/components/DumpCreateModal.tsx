"use client"
import React, { useCallback, useState } from 'react'
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
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from 'axios';

const DumpCreateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name,setName] = useState('')
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast()

  
  const handleCreation = useCallback(async () => {
    try {
      await axios.post("/api/dumpbox",{name});
      await toast({
        title: "DumpBox Created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose()
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }finally{
        setName('')
    }
  }, [name,toast,setName,onClose]);

  return (
    <>
      <Button colorScheme="green" size="md" onClick={onOpen}>
        <Text fontSize="large" fontWeight="light">
          Create DumpBox
        </Text>
      </Button>
     

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name Of The Dump Box</FormLabel>
              <Input ref={initialRef} placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={()=>handleCreation()}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DumpCreateModal
