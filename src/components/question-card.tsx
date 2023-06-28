import { type Proposition, type Question } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { CopyIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface QuestionCardProps {
  quizId: string;
  question: Question & {
    propositions: Proposition[];
  };
  index: number;
  onEdit: (
    question: Question & {
      propositions: Proposition[];
    }
  ) => void;
}

export const QuestionCard = ({
  quizId,
  question,
  index,
  onEdit,
}: QuestionCardProps) => {
  const ctx = api.useContext();
  const { mutate: duplicate } = api.quiz.duplicateQuestion.useMutation({
    onSuccess: async () =>
      await ctx.quiz.getFromUser.invalidate({ id: quizId }),
  });
  const { mutate: remove } = api.quiz.deleteQuestion.useMutation({
    onSuccess: async () =>
      await ctx.quiz.getFromUser.invalidate({ id: quizId }),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <p className="font-medium">Question {index + 1}</p>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onEdit(question)}
          >
            <PencilIcon className="h-5 w-5" />
            <span>Modifier</span>
          </Button>
          <Button
            variant="outline"
            className="w-9 p-0"
            onClick={() => remove({ quizId, questionId: question.id })}
          >
            <Trash2Icon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="w-9 p-0"
            onClick={() => duplicate({ quizId, questionId: question.id })}
          >
            <CopyIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-8 p-4">
        <p className="text-center text-lg font-semibold">{question.question}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.propositions.map((proposition) => (
            <div
              key={proposition.id}
              className={cn(
                "flex items-center justify-center rounded-lg border",
                {
                  "border-green-500 bg-green-100": proposition.isCorrect,
                  "border-red-500 bg-red-100": !proposition.isCorrect,
                }
              )}
            >
              <p className="px-3 py-2">{proposition.proposition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
