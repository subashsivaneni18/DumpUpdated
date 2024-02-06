"use client";

import React, { useCallback, useState } from "react";

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
  useToast,
} from "@chakra-ui/react";

import { signIn} from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

interface LoginModalProps {
  isInvitation?: boolean;
  boxId?: string;
}

const InviteLoginModal: React.FC<LoginModalProps> = ({ isInvitation, boxId }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    try {
      await signIn("credentials", { email: email, password: password });
      toast({
        title: "Logged In Sucessfully",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      await onClose()
      redirect(`/invite/${boxId}`);
    } catch (error) {
      console.log(error);
    }
  },[
    toast,
    onClose,
    email,
    password,
    boxId,
  ]);

  return (
    <div>
      <Button colorScheme="messenger" size="md" onClick={onOpen}>
        <Text fontSize="large" fontWeight="light">
          Login
        </Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
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
            <Button colorScheme="blue" mr={3} onClick={() => handleLogin()}>
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InviteLoginModal;
