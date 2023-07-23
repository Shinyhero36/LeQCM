import { NextResponse } from "next/server";
import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";

type PublicMetadata = {
  role?: "admin";
  isInvited?: boolean;
};

export default authMiddleware({
  publicRoutes: ["/", "/og.png"],
  async afterAuth(auth, req) {
    const headers = new Headers(req.headers);
    const referer = headers.get("referer");
    const path = new URL(req.url).pathname;

    if (auth.isPublicRoute) return NextResponse.next();

    if (!auth.userId) {
      if (referer && !path.startsWith("/api")) {
        const refererURL = new URL(path, referer).href;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return redirectToSignIn({ returnBackUrl: refererURL });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId) {
      const pubMeta = (await clerkClient.users.getUser(auth.userId))
        .publicMetadata as PublicMetadata;

      if (pubMeta.role === "admin" || pubMeta.isInvited)
        return NextResponse.next();

      // TODO: Replace with "/invite" and create the page
      const inviteURL = new URL("/", new URL(req.url).origin);
      return NextResponse.redirect(inviteURL);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
