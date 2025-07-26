import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("middleware running")
  const token = request.cookies.get('token')?.value
console.log('middleware token', token)
console.log(request.cookies.get('token'))
  const publicPaths = ['/', '/login', '/registration']

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  console.log(isPublicPath,"is public path?")

  // ✅ If it's a public page and user is logged in, redirect to dashboard or books page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/books/listing', request.url))
  }


  // 🔒 If it's a protected route and user is NOT logged in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Otherwise, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - favicon.ico
     * - images or API routes if needed
     */
    '/((?!_next/static|_next/image|favicon.ico|api|images).*)',
  ],
}