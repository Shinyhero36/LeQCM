import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const waitlistRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.waitlist.findMany();
  }),
  join: privateProcedure
    .input(
      z
        .string({
          required_error: "Un email est requis",
          invalid_type_error: "Il ne s'agit pas d'un email valide",
        })
        .email("Il ne s'agit pas d'un email valide")
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.waitlist.create({
          data: {
            email: input,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous êtes déjà inscrit à la liste d'attente.",
        });
      }
    }),
});
