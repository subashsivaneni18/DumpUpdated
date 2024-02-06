import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { boxId: string } }
) {
  try {
    const data: string[] = await req.json();

    if (!params.boxId || typeof params.boxId !== "string") {
      throw new Error("Invalid BoxId");
    }

    if (!data || data.length === 0) {
      throw new Error("At least one Pic is required");
    }

    // Delete images from the database
    await Promise.all(
      data.map(async (id: string) => {
        await prisma.image.delete({
          where: {
            id: id as string,
          },
        });
      })
    );

    // Fetch the updated ImageIds from the database after deletion
    const updatedImageIds = await prisma.dumpBox.findUnique({
      where: {
        id: params.boxId,
      },
      select: {
        ImageIds: true,
      },
    });

    // Assuming ImageIds is an array, you can filter out the deleted image IDs
    const newImageIds = updatedImageIds?.ImageIds.filter(
      (id) => !data.includes(id)
    );

    // Update the database with the new ImageIds
    const updatedBox = await prisma.dumpBox.update({
      where: {
        id: params.boxId,
      },
      data: {
        ImageIds: newImageIds,
      },
    });

    return NextResponse.json(updatedBox)

  } catch (error) {
    console.log(error);
  }
}
