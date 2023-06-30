import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/og", "/favicon.ico"],
  afterAuth(auth, req, _evt) {
    // Handle public routes
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }
    // Handle users who are not authenticated
    if (!auth.userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
