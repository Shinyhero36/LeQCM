import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const MAX_QUESTION_NUMBER = 999;

export const quizRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().nonempty().max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
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
          creator: ctx.userId,
          questions: {
            create: [],
          },
          timeToAnswer: 30,
        },
      });

      return quiz;
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.delete({
        where: {
          id: input.id,
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
            orderBy: {
              order: "asc",
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
        include: {
          questions: {
            select: {
              id: true,
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

      const question = await ctx.prisma.question.create({
        data: {
          quizId: input.quizId,
          question: input.question,
          propositions: {
            create: input.propositions,
          },
          order: quiz.questions.length,
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
        include: {
          questions: {
            select: {
              id: true,
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
          order: quiz.questions.length,
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
        include: {
          questions: {
            select: {
              id: true,
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

      // Delete question and update order of other questions
      await ctx.prisma.question.delete({
        where: {
          id: input.questionId,
        },
      });

      await ctx.prisma.question.updateMany({
        where: {
          quizId: input.quizId,
          order: {
            gt: question.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
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
          order: question.order,
        },
      });

      return newQuestion;
    }),
  updateQuestionsOrder: privateProcedure
    .input(
      z.object({
        quizId: z.string().nonempty(),
        questions: z
          .object({
            id: z.string().nonempty(),
            order: z.number(),
          })
          .array()
          .min(1),
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

      const questions = await ctx.prisma.question.findMany({
        where: {
          quizId: input.quizId,
        },
      });

      if (questions.length !== input.questions.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Le nombre de questions ne correspond pas",
        });
      }

      // Update questions order a first time to max value to avoid unique constraint error
      await Promise.all(
        questions.map((question, index) =>
          ctx.prisma.question.update({
            where: {
              id: question.id,
            },
            data: {
              order: MAX_QUESTION_NUMBER * 2 - index,
            },
          })
        )
      );

      // Update questions order
      await Promise.all(
        input.questions.map((question) =>
          ctx.prisma.question.update({
            where: {
              id: question.id,
            },
            data: {
              order: question.order,
            },
          })
        )
      );
    }),
});
