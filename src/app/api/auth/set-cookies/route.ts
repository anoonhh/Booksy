import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try{
        const {token , role} = await req.json() ///getting token and role from set cookie
    
        if(!token || !role){
            return NextResponse.json({message: 'Missing token or role'}, {status: 400})
        }else{
    
            const cookieStore = cookies()
    
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24,
            })
    
            cookieStore.set('role', role, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24,
            })
    
            return NextResponse.json({ message : 'Cookie set successfully!'})
        }
    }catch(err){
        console.log('cookiee error', err)
        return NextResponse.json({ message: 'Server error while setting cookies' }, { status: 500 });
    }

}
