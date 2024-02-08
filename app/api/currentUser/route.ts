import { authOptions } from "@/libs/authOptions"
import prisma from "@/libs/prismadb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const dynamic = "force-dynamic";
export async function GET(req:Request)
{
    try {
        const session = await getServerSession(authOptions)

        if(!session)
        {
            throw new Error('Invalid Session')
        }

        const email = session.user?.email

        if(!email || typeof email !== 'string')
        {
            throw new Error('Invalid Email')
        }

        const currentUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!currentUser)
        {
            return NextResponse.json("No User Found")
        }

        return NextResponse.json(currentUser)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}