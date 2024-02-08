import { NextResponse } from "next/server"
import prisma from '@/libs/prismadb'
export async function GET(req:Request,{params}:{params:{boxId:string}})
{
    try {
        const id = params.boxId

        if(!id || typeof id !== "string")
        {
            throw new Error('Invalid id')
        }

        const dumpBoxUserIds = await prisma.dumpBox.findUnique({
            where:{
                id:params.boxId
            },
            select:{
                userIds:true
            }
        })

        return NextResponse.json(dumpBoxUserIds?.userIds);
    } catch (error) {
        console.log(error)
        return NextResponse.json("Fetching Error")
    }
}