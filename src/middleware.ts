import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api or trpc (API routes) => except for /api/og
   * - _next/static (static files)
   * - _next/image (image optimization files)
   */
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(?!/og)(.*)"],
};
