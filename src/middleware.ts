import { NextResponse } from "next/server";
import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";

type PublicMetadata = {
  role?: "admin";
  isInvited?: boolean;
};

export default authMiddleware({
  debug: true,
  publicRoutes: ["/", "/og.png"],
  async afterAuth(auth, req) {
    const response = NextResponse.next();
    console.log("Experimental:", req.experimental_clerkUrl);
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

    if (auth.userId) {
      const pubMeta = (await clerkClient.users.getUser(auth.userId))
        .publicMetadata as PublicMetadata;

      if (pubMeta.role === "admin" || pubMeta.isInvited) return response;

      // TODO: Replace with "/invite" and create the page
      const inviteURL = new URL("/", new URL(req.url).origin);
      return NextResponse.redirect(inviteURL);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
