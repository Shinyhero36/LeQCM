import { useState } from "react";
import { type GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { type Proposition, type Question } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "@/components/create-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { EmptyState } from "@/components/empty-state";
import { Logo } from "@/components/logo";
import { QuestionCard } from "@/components/question-card";
import { QuizMetadataCard } from "@/components/quiz-metadata";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { LogOutIcon, PlusIcon } from "lucide-react";

export default function EditorPage({ id }: { id: string }) {
  const router = useRouter();

  const [openMetaForm, setOpenMetaForm] = useState(false);
  const [openAddQuestionForm, setOpenAddQuestionForm] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<
    | (Question & {
        propositions: Proposition[];
      })
    | null
  >(null);

  const { data: quiz, isLoading } = api.quiz.getFromUser.useQuery({ id });

  const goBackToDashboard = () => router.push("/dashboard");

  if (isLoading || !quiz) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg
          className="h-10 w-10 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>LE QCM | Editor</title>
        {/* TODO: Add basic head tags */}
      </Head>
      {quiz && openAddQuestionForm && (
        <CreateQuestionDialog
          open={openAddQuestionForm}
          setOpen={setOpenAddQuestionForm}
          quizId={quiz.id}
        />
      )}
      {questionToEdit && (
        <EditQuestionDialog
          open={!!questionToEdit}
          setOpen={setQuestionToEdit}
          question={questionToEdit}
          quizId={quiz.id}
        />
      )}
      <div className="min-h-screen">
        <nav className="min-h-16 fixed z-40 flex w-full items-center justify-between border-b bg-white p-4">
          <Logo theme="light" />
          <Button className="gap-2" onClick={goBackToDashboard}>
            <LogOutIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
        </nav>
        <main className="mx-auto max-w-7xl px-5 py-6 pt-24 sm:px-10">
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="col-span-8">
              <div className="mb-5 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">
                  {quiz?.questions.length} question
                  {quiz?.questions.length > 1 && "s"}
                </h1>
                <Button onClick={() => setOpenAddQuestionForm(true)}>
                  <PlusIcon className="h-5 w-5" />
                  <span>Ajouter une question</span>
                </Button>
              </div>
              {quiz?.questions.length ? (
                <div className="space-y-5">
                  {quiz.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      quizId={id}
                      onEdit={setQuestionToEdit}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Aucune question"
                  description="Vous n'avez pas encore ajouté de question à votre quiz"
                  actions={
                    <>
                      <Button
                        className="gap-2"
                        onClick={() => setOpenAddQuestionForm(true)}
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Ajouter une question</span>
                      </Button>
                    </>
                  }
                />
              )}
            </div>
            <div className="sticky top-24 col-span-4 hidden self-start lg:block">
              {quiz && (
                <QuizMetadataCard
                  quiz={quiz}
                  open={openMetaForm}
                  setOpen={setOpenMetaForm}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  if (typeof id !== "string") throw new Error("Quiz ID not found");

  const ssg = generateSSGHelper();
  await ssg.quiz.getFromUser.prefetch({
    id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
