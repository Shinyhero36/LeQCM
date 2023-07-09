import { type Proposition, type Question } from "@prisma/client";

interface QuestionCardProps {
  question: Question & {
    propositions: Proposition[];
  };
  index: number;
}

export const QuestionDndCard = ({ question, index }: QuestionCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <p className="font-medium">Question {index + 1}</p>
      </div>
      <div className="space-y-8 p-4">
        <p className="text-center text-lg font-semibold">{question.question}</p>
      </div>
    </div>
  );
};
