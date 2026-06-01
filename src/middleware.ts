import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("inoveesg_token")?.value;
  const { pathname } = request.nextUrl;

  // Define quais rotas são protegidas
  const isProtectedPage = pathname.startsWith("/app") || pathname.startsWith("/admin");

  if (isProtectedPage && !token) {
    // Redireciona para a landing com o modal de login aberto
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("auth", "true");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*", 
    "/app", 
    "/admin/:path*", 
    "/admin"
  ],
};
