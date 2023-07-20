import { useEffect, useState } from "react";
import { type GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Proposition, type Question } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { CreateQuestionDialog } from "@/components/create-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { QuestionCard } from "@/components/question-card";
import { QuestionDndCard } from "@/components/question-dnd-card";
import { QuizMetadataCard } from "@/components/quiz-metadata";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { MenuIcon, PlusIcon, SaveIcon } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

type FullQuestion = Question & {
  propositions: Proposition[];
};

const MAX_QUESTIONS = 999;

export default function EditorPage({ id }: { id: string }) {
  const { toast } = useToast();

  const [openSheet, setOpenSheet] = useState(false);
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
    } else if (quiz && quiz.questions.length > 0) {
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

      {/* Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="bg-stone-200">
          <Sidebar className="flex w-auto" />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen bg-stone-300/25">
        {/* Fixed sidebar */}
        <Sidebar />
        {/* Content */}
        <main className="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-scroll rounded-xl bg-white p-8 shadow-lg md:ml-0">
          {/* Header */}
          <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {quiz?.name}
                </h2>
                <p className="text-sm text-stone-500">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => setOpenSheet(!openSheet)}
                className="inline-flex md:hidden"
              >
                <MenuIcon className="h-8 w-8" />
              </Button>
            </div>

            {/* Actions */}
            {quiz && (
              <div className="flex flex-col gap-4 sm:flex-row">
                {!reorderMode && (
                  <Button
                    variant="outline"
                    onClick={() => setOpenMetaForm(true)}
                    className="mt-4 w-full sm:mt-0 sm:w-auto lg:hidden"
                  >
                    <span>Paramètres</span>
                  </Button>
                )}
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
                    variant="outline"
                    onClick={() => setReorderMode(!reorderMode)}
                    className="w-full sm:mt-0 sm:w-auto"
                    disabled={quiz.questions.length < 2}
                  >
                    <span>Modifier l&apos;ordre</span>
                  </Button>
                )}
                {!reorderMode && (
                  <Link
                    href={quiz.questions.length > 0 ? `/play/${id}` : "#"}
                    className={cn(buttonVariants(), "lg:hidden", {
                      "cursor-not-allowed opacity-50":
                        quiz.questions.length === 0,
                    })}
                  >
                    Lancer une partie
                  </Link>
                )}
              </div>
            )}
          </div>

          <hr className="my-6 h-[1px] w-full shrink-0 bg-border" />

          <div className="grid gap-5 lg:grid-cols-12">
            <div className="col-span-8">
              <Cards />
            </div>
            <div className="sticky top-0 col-span-4 hidden self-start lg:block">
              {quiz && (
                <QuizMetadataCard
                  quiz={quiz}
                  open={openMetaForm}
                  setOpen={setOpenMetaForm}
                  startable={quiz.questions.length > 0}
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
