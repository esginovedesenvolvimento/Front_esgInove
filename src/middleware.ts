import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware desativado temporariamente a pedido do usuário para permitir acesso livre
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
