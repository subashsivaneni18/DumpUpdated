import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { BoxId: string } }
) {
  try {
    const id = params.BoxId;

    if (!id || typeof id !== "string") {
      throw new Error(`Invalid Id`);
    }

    const isTrueId = await prisma.dumpBox.findMany({
      where:{
        id:params.BoxId
      }
    })

    if(!isTrueId)
    {
      throw new Error(`Invalid Id`)
    }

    const CurrentBox = await prisma.dumpBox.findUnique({
      where: {
        id: id as string,
      },
    });

    return NextResponse.json(CurrentBox);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Box Fethching Error");
  }
}
