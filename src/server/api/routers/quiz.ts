import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const quizRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().nonempty().max(50),
        description: z.string().max(200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;
      const quizzesName = await ctx.prisma.quiz.findMany({
        where: { name, creator: ctx.userId },
      });

      if (quizzesName.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un quiz avec ce nom existe déjà",
        });
      }

      const quiz = await ctx.prisma.quiz.create({
        data: {
          name,
          description,
          creator: ctx.userId,
          questions: {
            create: [],
          },
          timeToAnswer: 30,
        },
      });

      return quiz;
    }),
  getAllFromUser: privateProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany({
      where: {
        creator: ctx.userId,
      },
      include: {
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    return quizzes;
  }),
  getFromUser: privateProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id,
        },
        include: {
          questions: {
            include: {
              propositions: true,
            },
          },
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce quiz n'existe pas",
        });
      }

      return quiz;
    }),
  updateMetadata: privateProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        timeToAnswer: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          timeToAnswer: input.timeToAnswer,
        },
      });

      return quiz;
    }),
  addQuestion: privateProcedure
    .input(
      z.object({
        quizId: z.string().nonempty(),
        question: z.string().nonempty(),
        propositions: z
          .object({
            proposition: z.string().min(1).max(120),
            isCorrect: z.boolean(),
          })
          .array()
          .min(1)
          .max(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce quiz n'existe pas",
        });
      }

      const question = await ctx.prisma.question.create({
        data: {
          quizId: input.quizId,
          question: input.question,
          propositions: {
            create: input.propositions,
          },
        },
      });

      return question;
    }),
  duplicateQuestion: privateProcedure
    .input(
      z.object({
        quizId: z.string().nonempty(),
        questionId: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce quiz n'existe pas",
        });
      }

      const question = await ctx.prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
        include: {
          propositions: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cette question n'existe pas",
        });
      }

      const newQuestion = await ctx.prisma.question.create({
        data: {
          quizId: input.quizId,
          question: question.question,
          propositions: {
            create: question.propositions.map((proposition) => ({
              proposition: proposition.proposition,
              isCorrect: proposition.isCorrect,
            })),
          },
        },
      });

      return newQuestion;
    }),
  deleteQuestion: privateProcedure
    .input(
      z.object({
        quizId: z.string().nonempty(),
        questionId: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce quiz n'existe pas",
        });
      }

      const question = await ctx.prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cette question n'existe pas",
        });
      }

      await ctx.prisma.question.delete({
        where: {
          id: input.questionId,
        },
      });
    }),
  updateQuestion: privateProcedure
    .input(
      z.object({
        quizId: z.string().nonempty(),
        questionId: z.string().nonempty(),
        question: z.string().nonempty(),
        propositions: z
          .object({
            proposition: z.string().min(1).max(120),
            isCorrect: z.boolean(),
          })
          .array()
          .min(1)
          .max(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce quiz n'existe pas",
        });
      }

      const question = await ctx.prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cette question n'existe pas",
        });
      }

      // Delete previous question and recreate the question
      // No need for an ID in this case
      await ctx.prisma.question.delete({
        where: {
          id: input.questionId,
        },
      });

      const newQuestion = await ctx.prisma.question.create({
        data: {
          quizId: input.quizId,
          question: input.question,
          propositions: {
            create: input.propositions,
          },
        },
      });

      return newQuestion;
    }),
});
