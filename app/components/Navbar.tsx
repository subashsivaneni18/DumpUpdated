"use client"
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { Avatar, Button,  Text, useToast } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import DumpCreateModal from "./DumpCreateModal";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";

interface NavbarProps{
  DumpBoxId?:string
}


const Navbar:React.FC<NavbarProps> = ({
  DumpBoxId
}) => {
  // State and hooks
  const Pathname = usePathname();
  const isHomePage = Pathname === "/";
  const isDashboard = Pathname.includes("/Dashboard");
  const isDumBoxPage = Pathname.includes("/Dumpbox");
  const toast = useToast();
  const router = useRouter()
  const { status } = useSession();
  const [data, setData] = useState<string[]>([]);
  const [DumpboxId, setDumpboxId] = useState("");

  
    const { mutate: mutateImages } = useSWR(
      `/api/AddData/${DumpBoxId}`,
      fetcher
    );
    const {mutate:mutateDumpBox} = useSWR(`/api/dumpbox/${DumpBoxId}`,fetcher)
    

 
    


  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push('/')
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [toast,router]);

  
  
  useEffect(() => {
    setDumpboxId(Pathname.split("/").pop() || "");
  }, [Pathname]);

  


  const handleUploading = useCallback(async (urls:string[]) => {
    try {
      if (urls.length > 0) {
        await axios.post(`/api/AddData/${DumpboxId}`, urls);
        mutateImages()
        mutateDumpBox()
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
  }, [ DumpboxId, toast,mutateImages,mutateDumpBox]);

  const {data:currentUser} = useSWR<User>('/api/current',fetcher)




  return (
    <div className="w-full fixed top-0 bg-white px-6 py-5 flex justify-between items-center z-20 shadow-lg text-[#2d2c2d]">
      <p className="text-xl font-semibold">Dumper</p>
      <div className="flex gap-5">
        {isHomePage && <RegisterModal />}
        {isHomePage && <LoginModal />}

        {status === "authenticated" && (
          <Button colorScheme="red" size="md" onClick={handleLogout}>
            <Text fontSize="large" fontWeight="light">
              Logout
            </Text>
          </Button>
        )}

        {isDashboard && <DumpCreateModal />}

        {isDashboard && (
          <div className="cursor-pointer" onClick={()=>router.push(`/profile/${currentUser?.id}`)}>
            <Avatar src={currentUser?.image || ""} />
          </div>
        )}

       
      </div>
    </div>
  );
};

export default Navbar;
