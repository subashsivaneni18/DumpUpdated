"use client";
import fetcher from "@/libs/fetcher";
import { Box, Button, CloseButton, Image } from "@chakra-ui/react";
import { Image as PrismaImage } from "@prisma/client";

import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

// ... (previous imports)

const Page = ({ params }: { params: { boxId: string } }) => {
  const { data: images = [] } = useSWR<PrismaImage[]>(
    `/api/AddData/${params.boxId}`,
    fetcher
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [urls, setUrls] = useState<string[] | []>([]);

  useEffect(() => {
    const imgUrls = images.map((img: PrismaImage) => {
      setUrls((data) => [...data, img.url]);
    });
  }, [setUrls,images]);

  const handleForward = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [setCurrentImageIndex, images.length]);

  const handleBackward = useCallback(() => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [setCurrentImageIndex, images.length]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <div className="w-screen justify-end flex">
        <CloseButton onClick={() => {}} />
      </div> */}
      <div style={{ width: "80%", height: "80vh", position: "relative" }}>
        <Image
          src={images?.[currentImageIndex]?.url}
          objectFit="contain"
          alt="dfghj"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className="flex gap-5 justify-center mt-4">
        <Button onClick={handleBackward}>Back</Button>
        <Button onClick={handleForward}>Next</Button>
      </div>
    </div>
  );
};

export default Page;
