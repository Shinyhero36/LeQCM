import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

// Prefetch queries on the server
export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
