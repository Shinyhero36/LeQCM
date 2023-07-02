import { NextResponse } from "next/server";
import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";

type PublicMetadata = {
  role?: "admin";
  isInvited?: boolean;
};

export default authMiddleware({
  publicRoutes: ["/", "/og.png"],
  async afterAuth(auth, req) {
    console.log("BASE URL", req.url);
    if (auth.isPublicRoute) return NextResponse.next();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (!auth.userId) return redirectToSignIn({ returnBackUrl: req.url });

    if (auth.userId) {
      // const pubMeta = (await clerkClient.users.getUser(auth.userId))
      // .publicMetadata as PublicMetadata;

      // if (pubMeta.role === "admin" || pubMeta.isInvited)
      return NextResponse.next();

      // TODO: Replace with "/invite" and create the page
      // const url = req.nextUrl.clone();
      // url.pathname = "/";
      // return NextResponse.redirect(url);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
