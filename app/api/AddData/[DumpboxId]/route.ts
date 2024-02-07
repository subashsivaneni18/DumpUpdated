import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { DumpboxId: string } }
) {
  try {
    const data = await req.json();

    const session = await getServerSession(authOptions)

    if(!session || typeof session.user?.email!=='string')
    {
      throw new Error('unauthorized')
    }

    const currentUser = await prisma.user.findUnique({
      where:{
        email:session?.user?.email as string
      }
    })

    if(!params.DumpboxId || typeof params.DumpboxId!=='string')
    {
      throw new Error('Invalid Id')
    }

    const isAdmin = await prisma.dumpBox.findUnique({
      where:{
        id:params.DumpboxId as string,
        AdminsIds:{
          has:currentUser?.id as string
        }
      }
      
    })

    if(!isAdmin)
    {
      throw new Error('only admins can dump')
    }


    for(var i=0;i<data.length;i++)
    {
      
        const createdImage = await prisma.image.create({
          data:{
            url:data[i],
            DumpBoxId:params.DumpboxId
          }
        })

        await prisma.dumpBox.update({
          where:{
            id:params.DumpboxId
          },
          data:{
            ImageIds:{
              push:createdImage.id
            }
          }
        })

    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Error updating user"); 
  }
}

export async function GET(req: Request, { params }: { params: { DumpboxId :string}})
{
  try {
    const DumpboxId = params.DumpboxId

    if(!DumpboxId || typeof DumpboxId!=='string')
    {
      throw new Error('DumpboxId must be a string')
    }

    const images = await prisma.dumpBox.findUnique({
      where:{
        id:DumpboxId
      },
      select:{
        images:true
      }
    })

    

    return NextResponse.json(images?.images)
  } catch (error) {
    console.log(error)
    return NextResponse.json("Fetching Error")
  }
}
