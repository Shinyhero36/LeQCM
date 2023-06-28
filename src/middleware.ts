import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)", "/favicon.ico"],
  // matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
