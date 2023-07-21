import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const { data: quizzes, isLoading } = api.quiz.getAllFromUser.useQuery();
  const ctx = api.useContext();
  const { mutate: createQuiz, isLoading: isCreating } =
    api.quiz.create.useMutation({
      onSuccess: async (data) => {
        await ctx.quiz.getAllFromUser.invalidate();
        setOpenCreateModal(false);
        await router.push(`/app/quiz/${data.id}/edit`);
      },
      onError: (error) => {
        toast({
          title: "Impossible de créer un nouveau quiz",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  const { mutate: deleteQuiz } = api.quiz.delete.useMutation({
    onSuccess: async () => {
      await ctx.quiz.getAllFromUser.invalidate();
      setOpenDeleteQuizModal(false);
      setQuizToDelete(null);
    },
  });

  const QuizCards = () => {
    if (isLoading) return <LoadingState />;
    if (!quizzes || quizzes.length === 0)
      return (
        <EmptyState
          title="Aucun quiz"
          description="Vous n'avez pas encore créé de quiz."
          actions={
            <>
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => setOpenCreateModal(true)}
              >
                <PlusIcon className="h-5 w-5" />
                Créer un nouveau quiz
              </Button>
            </>
          }
        />
      );
    return (
      <>
        {quizToDelete && (
          <AlertDialog
            open={openDeleteQuizModal}
            onOpenChange={setOpenDeleteQuizModal}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr de vouloir supprimer ce quiz ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Une fois supprimé il n&apos;est pas possible de faire machine
                  arrière.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteQuiz({ id: quizToDelete })}
                >
                  Oui, supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link
              href={`/app/quiz/${quiz.id}/edit`}
              key={quiz.id}
              className="group"
            >
              <div className="flex flex-col overflow-hidden rounded-lg border px-6 py-4 transition-colors group-hover:border-stone-500">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{quiz.name}</h3>
                    <p className="text-stone-700">
                      {quiz.questions.length} question
                      {quiz.questions.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                    >
                      <MoreVerticalIcon className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setQuizToDelete(quiz.id);
                          setOpenDeleteQuizModal(true);
                        }}
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-6 text-sm text-stone-700">
                  Dernière modification le{" "}
                  {quiz.updatedAt.toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  const formSchema = z.object({
    name: z
      .string()
      .nonempty({
        message: "Le titre ne peut pas être vide",
      })
      .max(50, {
        message: "Le titre ne doit pas dépasser 50 caractères",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <>
      <Head>
        <title>Le QCM | Dashboard</title>
        {/* TODO: Add basic head tags */}
      </Head>

      {/* Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="bg-stone-200">
          <Sidebar quizzes={quizzes} className="flex w-auto" />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen bg-stone-300/25">
        {/* Fixed sidebar */}
        <Sidebar quizzes={quizzes} />
        {/* Content */}
        <main className="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-scroll rounded-xl bg-white p-8 shadow-lg  md:ml-0 ">
          {/* Header */}
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Mes quiz
                </h2>
                <p className="text-sm text-stone-500">
                  Créez et gérez vos quiz
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

            <div className="flex space-x-2">
              <Dialog
                open={openCreateModal}
                onOpenChange={(open) => {
                  if (!isCreating) {
                    setOpenCreateModal(open);
                    form.reset();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full gap-2 sm:w-auto">
                    <PlusIcon className="h-5 w-5" />
                    Créer un quiz
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau quiz</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      autoComplete="off"
                      onSubmit={form.handleSubmit((data) => {
                        createQuiz(data);
                      })}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isCreating}>
                        Créer
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr className="my-6 h-[1px] w-full shrink-0 bg-border" />
          {/* Quizzes */}
          <QuizCards />
        </main>
      </div>
    </>
  );
}
