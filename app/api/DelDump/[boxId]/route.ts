import { NextResponse } from "next/server"
import prisma from '@/libs/prismadb'
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"

export async function DELETE(req:Request,{params}:{params:{boxId:string}})
{
    try {
        const id = params.boxId

        const session = await getServerSession(authOptions)

        if(!session || typeof session.user?.email!=='string')
        {
            throw new Error('Invalid session')
        }

        const currentUser = await prisma.user.findUnique({
            where:{
                email:session.user.email
            }
        })

        if(!id || typeof id !== "string")
        {
            throw new Error('Invalid Id')
        }

        const Ids = await prisma.dumpBox.findUnique({
            where:{
                id:params.boxId
            },
            select:{
                AdminsIds:true,
                userIds:true,
            }
        })

        const isAdmin = Ids?.AdminsIds.includes(currentUser?.id as string);
        

        if(!isAdmin)
        {
            return NextResponse.json({message:"Only Admin Can Delete The DumpBox"})
        }

        const imageIds = await prisma.dumpBox.findUnique({
            where:{
                id:params.boxId
            },
            select:{
                ImageIds:true
            }
        })

        imageIds?.ImageIds.map(async(imageId)=>{
            await prisma.image.delete({
                where:{
                    id:imageId
                }
            })
        })

        await prisma.dumpBox.delete({
            where:{
                id:params.boxId
            }
        })

        

        return NextResponse.json("deleted")

    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}