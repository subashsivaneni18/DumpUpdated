import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";


export async function GET(
  req:Request ,
  { params }: { params: { boxId: string } }
) {
  try {
    const id = params.boxId;

    if (!id || typeof id !== "string") {
      throw new Error("Invalid Id");
    }

    const dumpbox = await prisma.dumpBox.findUnique({
      where: {
        id: params.boxId as string,
      },
    });

    if (!dumpbox) {
      throw new Error("DumpBox not found");
    }

    const userIds = await prisma.dumpBox.findUnique({
      where: {
        id: params.boxId,
      },
      select: {
        userIds: true,
      },
    });

    if(!userIds || typeof userIds==='undefined')
    {
        throw new Error("UserIds not found");
    }

    let result: any[] = [];

    if (userIds?.userIds.length > 0) {
      result = await Promise.all(
        userIds.userIds.map(async (userId) => {
          const user = await prisma.user.findUnique({
            where: {
              id: userId as string,
            },
          });

          if (user) {
            const isAdmin = dumpbox.AdminsIds.includes(user.id);

            return {
              ...user,
              isAdmin: isAdmin,
            };
          } else {
            return null; 
          }
        })
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" })
  }
}
