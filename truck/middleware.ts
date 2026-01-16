import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/veiculos",
  "/fretes",
  "/retorno",
  "/matches",
  "/chat",
  "/perfil"
]

const authRoutes = ["/login", "/registro"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user has a session token
  const sessionToken = request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!sessionToken

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
