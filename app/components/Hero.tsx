import { Button, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import LoginModal from './LoginModal';

const Hero = () => {


  return (
    <div className="text-black w-full flex items-center justify-center h-[calc(100vh-90px)]">
      <div className='flex flex-col justify-center items-center'>
        <Text fontSize="58px" align="center">
          The Home For Your
          <br /> Memories
        </Text>
        <Button colorScheme="messenger" size="md">
          <Text fontSize="large" fontWeight="light">
            Get Dumper Photos
          </Text>
        </Button>
      </div>
    </div>
  );
}

export default Hero
