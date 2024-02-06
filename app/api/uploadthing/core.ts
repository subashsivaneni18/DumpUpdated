import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "@/libs/authOptions";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthenticated");
  }

  return {}; 
};

export const ourFileRouter = {
  DumpBoxImages: f({ image: { maxFileSize: "32MB", maxFileCount: 40 } })
    .middleware(async () => await auth())
    .onUploadComplete(() => console.log("upload Completed")),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
