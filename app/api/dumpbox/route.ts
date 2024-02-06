import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from '@/libs/prismadb'
import { NextResponse } from "next/server"

export async function POST(req:Request)
{
    try {
       const {name} = await req.json() 
       const session = await getServerSession(authOptions)

       const currentUser = await prisma.user.findUnique({
        where:{
            email:session?.user?.email as string
        }
       })
    
       const newDumpBox = await prisma.dumpBox.create({
         data: {
           name: name as string,
           userIds:[currentUser?.id as string],
           AdminsIds:[currentUser?.id as string]
         },
       });

       return NextResponse.json(newDumpBox)

    } catch (error) {
        console.log(error)
    }
}