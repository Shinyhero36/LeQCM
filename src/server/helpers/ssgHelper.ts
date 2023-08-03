import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

// Prefetch queries on the server
export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      auth: {
        sessionClaims: null,
        sessionId: null,
        session: null,
        actor: null,
        userId: null,
        user: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        organization: null,
        getToken: () => Promise.resolve(null),
        debug: () => undefined,
      },
    },
    transformer: superjson,
  });
