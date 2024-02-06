import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'
export async function GET(req:Request,{params}:{params:{id:string,}})
{
    try {
        const id = params.id

        if(!id || typeof id !== 'string')
        {
            throw new Error('Invalid id')
        }
        const isExist = await prisma.image.findUnique({
            where:{
                id:id
            }
        })

        if(!isExist)
        {
            throw new Error('Image Not Found')
        }

        return NextResponse.json(isExist.url)
    } catch (error) {
        console.log(error)
    }
}