import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SignedIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EmptyState } from "@/components/empty-state";
import { NavBar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";

export default function Home() {
  const router = useRouter();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { data: quizzes, isLoading } = api.quiz.getAllFromUser.useQuery();
  const ctx = api.useContext();
  const { mutate: createQuiz, isLoading: isCreating } =
    api.quiz.create.useMutation({
      onSuccess: async (data) => {
        await ctx.quiz.getAllFromUser.invalidate();
        setOpenCreateModal(false);
        await router.push(`/editor/${data.id}`);
      },
    });

  const QuizCards = () => {
    if (isLoading)
      return (
        <div className="flex h-96 flex-col items-center justify-center">
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
    if (!quizzes || quizzes.length === 0)
      return (
        <EmptyState
          className="mt-6"
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
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Link href={`/editor/${quiz.id}`} key={quiz.id}>
            <div className="flex flex-col overflow-hidden rounded-lg border shadow-md">
              {/* Image placeholder */}
              <div className="relative aspect-video h-full w-full bg-black">
                {/* Question count */}
                <div className="bg-cod-500 absolute right-0 top-0 m-4 rounded px-2 py-1">
                  <span className="text-sm font-medium text-white">
                    {quiz.questions.length} question
                    {quiz.questions.length > 1 && "s"}
                  </span>
                </div>
              </div>
              {/* Fake info */}
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium">{quiz.name}</h3>
                <p className="text-cod-700 text-sm">
                  {quiz.description ?? "Pas de description"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
    description: z
      .string()
      .nonempty({
        message: "La description ne peut pas être vide",
      })
      .max(200, {
        message: "La description ne doit pas dépasser 200 caractères",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <>
      <Head>
        <title>Le QCM | Dashboard</title>
        {/* TODO: Add basic head tags */}
      </Head>

      <div className="min-h-screen">
        <NavBar />
        <SignedIn>
          <main className="mx-auto max-w-7xl px-5 py-6 sm:px-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-3xl font-medium">Dashboard</h2>
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
                  <Button className="gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Créer un nouveau quiz
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
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
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
            <QuizCards />
          </main>
        </SignedIn>
      </div>
    </>
  );
}
