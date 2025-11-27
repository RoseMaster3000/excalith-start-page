import { NextResponse } from 'next/server'

// This means middleware runs on EVERY request, but we filter manually below:

export function middleware(request) {
  const path = request.nextUrl.pathname
  // -------------------------------------------------------------
  // 1. SAFETY CHECKS (Bypass Middleware)
  // -------------------------------------------------------------
  if (path.startsWith('/_next')) return NextResponse.next()
  if (path.includes('.')) return NextResponse.next()
  if (path.startsWith('/api/login')) return NextResponse.next()
  if (path === '/login') return NextResponse.next()

  // -------------------------------------------------------------
  // 2. AUTHENTICATION CHECK
  // -------------------------------------------------------------
  const authCookie = request.cookies.get('my_secret_auth')
  if (authCookie && authCookie.value === 'true') {
    return NextResponse.next()
  }

  // -------------------------------------------------------------
  // 3. REDIRECT
  // -------------------------------------------------------------
  return NextResponse.redirect(new URL('/login', request.url))
}
