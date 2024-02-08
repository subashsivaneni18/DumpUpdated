import prisma from "@/libs/prismadb";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { boxId: string } }
) {
  try {
    if (!params.boxId || typeof params.boxId !== "string") {
      throw new Error("Invalid Id");
    }

    const AdminIds = await prisma.dumpBox.findUnique({
      where:{
        id:params.boxId
      },
      select:{
        AdminsIds:true
      }
    })

    return NextResponse.json(AdminIds?.AdminsIds);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
