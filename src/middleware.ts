import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/og.png"],
  afterAuth(auth, req) {
    const response = NextResponse.next();
    if (auth.isPublicRoute) return response;

    // if (auth.isApiRoute) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      response.headers.append("Access-Control-Allow-Origin", "*");
    }

    if (!auth.userId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignIn({
        /**
         * @see https://github.com/clerkinc/javascript/issues/1338
         */
        returnBackUrl: req.experimental_clerkUrl.href,
      });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
