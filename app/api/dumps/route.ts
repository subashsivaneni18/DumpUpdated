import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import prisma from '@/libs/prismadb'
export async function GET(req:Request)
{
    try {
        const session = await getServerSession(authOptions)

        if(!session)
        {
            throw new Error('Not Authenticated')
        }

        const currentUser = await prisma.user.findUnique({
            where:{
                email:session.user?.email as string
            }
        })

        if(!currentUser)
        {
            throw new Error('Not Authenticated')
        }

        const dumps = await prisma.dumpBox.findMany({
            where:{
                userIds:{
                    has:currentUser.id
                }
            }
        })

        return NextResponse.json(dumps)

    } catch (error) {
        console.log(error)
    }
}