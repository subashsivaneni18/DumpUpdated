import { authOptions } from "@/libs/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from '@/libs/prismadb'

export async function GET(req:Request)
{
  try {
    const session = await getServerSession(authOptions)

    if(!session || typeof session.user?.email!=='string')
    {
      throw new Error('Invalid Id')
    }

    const currentUser = await prisma.user.findUnique({
      where:{
        email:session.user.email as string
      }
    })

    if(!currentUser)
    {return null}

    return NextResponse.json(currentUser)

  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}