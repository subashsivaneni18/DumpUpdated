import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"
import prisma from '@/libs/prismadb'
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function GET(req:Request,{params}:{params:{boxId:string}})
{
    try {
        const boxId = params.boxId

        if(!boxId || typeof boxId!=='string')
        {
            throw new Error('Invalid BoxId')
        }

        const session = await getServerSession(authOptions)

        if(!session || typeof session.user?.email!=='string')
        {
            throw new Error("Unauthorized");
        }

        const DumpboxAdminIds = await prisma.dumpBox.findUnique({
            where:{
                id:boxId
            },
            select:{
                AdminsIds:true
            }
        })

        const currentUser = await prisma.user.findUnique({
            where:{ 
                email:session.user.email as string
            }
        })

        const isAdmin = DumpboxAdminIds?.AdminsIds.includes(currentUser?.id as string)

        return NextResponse.json({
            ...currentUser,
            isAdmin:isAdmin
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Something Went Wrong")
    }
}