import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'
export async function GET(req:Request,{params}:{params:{boxId:string}})
{
    try {
        const id = params.boxId

        if(!id || typeof id!=='string')
        {
            throw new Error('Invalid User Id')
        }

        const adminIds = await prisma.dumpBox.findUnique({
            where:{
                id:id
            },
            select:{
                 AdminsIds:true
            }
        })

        const parentId = adminIds?.AdminsIds[0]

        return NextResponse.json(parentId)
    } catch (error) {
        console.log(error)
    }
}