import prisma from '@/libs/prismadb'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server';
export async function POST(req:Request){
    try {
        const { email, username, password } = await req.json();

        if(!email || !password || !username)
        {
            throw new Error('Invalid Credentials')
        }

        const isAlready = await prisma.user.findUnique({
            where:{
                email:email as string
            }
        })

        if(isAlready)
        {
            throw new Error('User already exists')
        }

        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const user = await prisma.user.create({
            data:{
                email:email as string,
                username:username as string,
                hashedPassword:hashedPassword as string
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.log(error)
    }
}