"use client";



import { UploadButton, UploadDropzone } from "@/libs/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadButton
     endpoint="DumpBoxImages"
    />
  );
};
