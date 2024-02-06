import prisma from '@/libs/prismadb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server';
export async function PATCH(req:Request,{params}:{params:{boxId:string}})
{
    try {

        const session = await getServerSession(authOptions)

        if(!session || typeof session.user?.email!=='string')
        {
            throw new Error("Invalid Email");
        }

        const currentUser = await prisma.user.findUnique({
            where:{
                email:session.user.email as string
            }
        })

        if(!currentUser)
        {
            throw new Error('unAuthorized')
        }

        if(!params.boxId || typeof params.boxId!=='string')
        {
            throw new Error('Invalid Id')
        }

      const DumpBox = await prisma .dumpBox.findUnique({
        where:{
            id:params.boxId as string
        }
      }) 

      if(!DumpBox)
      {
        throw new Error(`Could not find Box`)
      }

      const userIds = await prisma.dumpBox.findUnique({
        where:{
            id:params.boxId as string
        },
        select:{
            userIds:true
        }
      })

      const isAlready = userIds?.userIds.includes(currentUser.id)

      if(isAlready)
      {
        return NextResponse.json("already Exists")
      }

      const updatedBox = await prisma.dumpBox.update({
        data:{
            userIds:{
                push:[currentUser.id]
            }
        },
        where:{
            id:params.boxId
        }
      })

      return NextResponse.json(updatedBox)
    } catch (error) {
        console.log(error)
    }
}