import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server';
export async function PATCH(req:Request,{params}:{params:{boxId:string}})
{
    try {
        const boxId = params.boxId

        const {id} = await req.json()

        if (!boxId || typeof boxId !== "string") {
          throw new Error("Invalid Id");
        }

        const dumpBoxUserIds = await prisma.dumpBox.findUnique({
            where:{
                id:boxId
            },
            select:{
                userIds:true
            }
        })

        if(!dumpBoxUserIds || typeof dumpBoxUserIds==='undefined' || typeof dumpBoxUserIds===null)
        {
            throw new Error('Invalid Id')
        }

        const updatedIds = dumpBoxUserIds.userIds.filter(userId=>userId!==id)

        const updatedDumpBox = await prisma.dumpBox.update({
            data:{
                userIds:{
                    set:updatedIds
                }
            },
            where:{
                id:boxId
            }
        })

        return NextResponse.json(updatedDumpBox)

    } catch (error) {
        console.log(error)
    }
}

export async function PUT(req:Request,{params}:{params:{boxId:string}})
{
    try {
       const boxId = params.boxId
       
       if(!boxId || typeof boxId!=='string')
       {
        throw new Error('Invalid Id')
       }

       const {userId} = await req.json()

       if(!userId || typeof userId!=='string')
       {
         throw new Error("Invalid Id");
       }

       const boxAdminIds = await prisma.dumpBox.findUnique({
        where:{
            id:boxId
        },
        select:{
            AdminsIds:true
        }
       })

       const isAdmin = boxAdminIds?.AdminsIds.includes(userId)

       const updatedIds:string[] =[]

       if(isAdmin)
       {
        const updatedIds = boxAdminIds?.AdminsIds.filter(id=>id!==userId)
       }
       else{
        const updatedIds=boxAdminIds?.AdminsIds.push(userId)
       }

       const updatedDumpBox = await prisma.dumpBox.update({
        data:{
            AdminsIds:updatedIds
        },
        where:{
            id:boxId
        }
       })

       return NextResponse.json(updatedDumpBox)

    } catch (error) {
        console.log(error)
    }
}