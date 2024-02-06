"use client";
import axios from 'axios'
import React, { useCallback, useState } from "react";
import { useToast } from "@chakra-ui/react";
  

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  Text,
} from "@chakra-ui/react";


interface RegisterModalProps {
  isInvitation?:boolean
}

const RegisterModal:React.FC<RegisterModalProps> = ({
  isInvitation
}) => {

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  

  const handleRegister = useCallback(async()=>{
    try {
        setIsLoading(true)
        await axios.post('/api/register',{email,username,password})
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
    } catch (error) {
        console.log(error)
        toast({
          title: "Something Went wrong",
          description: "Check your Credentials",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
    }
    finally{
        onClose()
        setIsLoading(false)
    }
  },[email,password,username,setIsLoading,onClose,toast])

  return (
    <div>
      <Button colorScheme="messenger" size="md" onClick={onOpen}>
        <Text fontSize="large" fontWeight="light">
          Register
        </Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text align="center" className="text-xl font-bold">
              Dumper
            </Text>
          </ModalBody>

          {/* Inputs */}

          <div className="flex flex-col gap-y-5 p-8">
            <Input
              placeholder="Email"
              size="md"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Username"
              size="md"
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputGroup size="md">
              <Input
                onChange={(e) => setPassword(e.target.value)}
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleRegister()}>
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RegisterModal;
