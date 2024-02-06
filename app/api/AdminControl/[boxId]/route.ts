import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { boxId: string } }
) {
  try {
    const boxId = params.boxId;

    if (!boxId || typeof boxId !== "string") {
      throw new Error("Invalid Id");
    }

    const { userId } = await req.json();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid Id");
    }

    const boxAdminIds = await prisma.dumpBox.findUnique({
      where: {
        id: boxId,
      },
      select: {
        AdminsIds: true,
      },
    });

    const isAdmin = boxAdminIds?.AdminsIds.includes(userId);

    let updatedIds: string[] = [];

    if (boxAdminIds?.AdminsIds) {
      if (isAdmin) {
        updatedIds = boxAdminIds.AdminsIds.filter((id) => id !== userId);
      } else {
        updatedIds = [...boxAdminIds.AdminsIds, userId];
      }
    } else {
      // Handle the case when AdminsIds is undefined (e.g., set default behavior)
      console.error("AdminsIds is undefined");
    }

    const updatedDumpBox = await prisma.dumpBox.update({
      data: {
        AdminsIds: updatedIds,
      },
      where: {
        id: boxId,
      },
    });

    return NextResponse.json(updatedDumpBox);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
