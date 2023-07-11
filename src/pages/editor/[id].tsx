import { useEffect, useState } from "react";
import { type GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Proposition, type Question } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreateQuestionDialog } from "@/components/create-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Logo } from "@/components/logo";
import { QuestionCard } from "@/components/question-card";
import { QuestionDndCard } from "@/components/question-dnd-card";
import { QuizMetadataCard } from "@/components/quiz-metadata";
import { cn } from "@/lib/utils";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { LogOutIcon, PlusIcon, SaveIcon } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

type FullQuestion = Question & {
  propositions: Proposition[];
};

const MAX_QUESTIONS = 999;

export default function EditorPage({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedQuestions, setReorderedQuestions] = useState<FullQuestion[]>(
    []
  );
  const [openMetaForm, setOpenMetaForm] = useState(false);
  const [openAddQuestionForm, setOpenAddQuestionForm] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<
    | (Question & {
        propositions: Proposition[];
      })
    | null
  >(null);

  const ctx = api.useContext();
  const { data: quiz, isLoading: isLoadingQuiz } =
    api.quiz.getFromUser.useQuery({ id });
  const { mutate: updateQuestionsOrder, isLoading: isReorderingQuestion } =
    api.quiz.updateQuestionsOrder.useMutation({
      onSuccess: async () => {
        toast({
          title: "Questions réordonnées",
          description: "Les questions ont été réordonnées avec succès",
        });
        await ctx.quiz.getFromUser.invalidate({ id });
        setReorderMode(false);
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de réordonner les questions",
        });
      },
    });

  const reorder = (
    list: FullQuestion[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) result.splice(endIndex, 0, removed);

    return result;
  };

  const goBackToDashboard = () => router.push("/dashboard");

  useEffect(() => {
    if (quiz && !reorderMode) {
      setReorderedQuestions(quiz.questions);
    }
  }, [quiz, reorderMode]);

  const Cards = () => {
    if (reorderMode) {
      return (
        <DragDropContext
          onDragEnd={(result) => {
            // dropped outside the list
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (!result.destination) {
              return;
            }

            const items = reorder(
              reorderedQuestions,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              result.source.index,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              result.destination.index
            );

            setReorderedQuestions(items);
          }}
        >
          <Droppable droppableId="droppable">
            {(provided, _snapshot) => (
              <div
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                {...provided.droppableProps}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                ref={provided.innerRef}
                className="space-y-5"
              >
                {reorderedQuestions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided, _snapshot) => (
                      <div
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        ref={provided.innerRef}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        {...provided.draggableProps}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        {...provided.dragHandleProps}
                      >
                        <QuestionDndCard question={question} index={index} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    } else if (quiz) {
      return (
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

          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              size={"lg"}
              onClick={() => {
                if (quiz.questions.length < MAX_QUESTIONS)
                  setOpenAddQuestionForm(true);
                else
                  toast({
                    title: "Limite atteinte",
                    description: `Vous avez atteint la limite de ${MAX_QUESTIONS} questions`,
                  });
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Ajouter une question</span>
            </Button>
          </div>
        </div>
      );
    } else if (isLoadingQuiz) {
      return <LoadingState />;
    } else {
      return (
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
      );
    }
  };

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
          quizId={id}
        />
      )}
      {questionToEdit && (
        <EditQuestionDialog
          open={!!questionToEdit}
          setOpen={setQuestionToEdit}
          question={questionToEdit}
          quizId={id}
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
              {quiz && (
                <div className="mb-5 items-center justify-between sm:flex">
                  <h1 className="text-3xl font-semibold">
                    {quiz.questions.length} question
                    {quiz.questions.length > 1 && "s"}
                  </h1>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={() => setOpenMetaForm(true)}
                      className="mt-4 w-full sm:mt-0 sm:hidden sm:w-auto"
                    >
                      <span>Paramètres</span>
                    </Button>
                    {reorderMode ? (
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => {
                            updateQuestionsOrder({
                              quizId: id,
                              questions: reorderedQuestions.map((q, index) => ({
                                ...q,
                                order: index,
                              })),
                            });
                          }}
                          className="w-full sm:mt-0 sm:w-auto"
                          disabled={isReorderingQuestion}
                        >
                          <SaveIcon className="mr-2 h-5 w-5" />
                          <span>Enregistrer</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setReorderMode(false)}
                          className="w-full sm:mt-0 sm:w-auto"
                          disabled={isReorderingQuestion}
                        >
                          <span>Annuler</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setReorderMode(!reorderMode)}
                        className="w-full sm:mt-0 sm:w-auto"
                        disabled={quiz.questions.length < 2}
                      >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        <span>Modifier l&apos;ordre des questions</span>
                      </Button>
                    )}
                    <Link
                      href={`/play/${id}`}
                      className={cn(buttonVariants(), "lg:hidden")}
                    >
                      Lancer une partie
                    </Link>
                  </div>
                </div>
              )}

              <Cards />
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
