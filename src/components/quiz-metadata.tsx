import { zodResolver } from "@hookform/resolvers/zod";
import { type Quiz } from "@prisma/client";
import { TimerIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

interface QuizMetadataCardProps {
  quiz: Quiz;
  open: boolean;
  setOpen(open: boolean): void;
}

export const QuizMetadataCard = ({
  quiz,
  open,
  setOpen,
}: QuizMetadataCardProps) => {
  const formSchema = z.object({
    name: z.string().nonempty("Le titre ne peux pas être vide").max(50, {
      message: "Le titre ne peux pas dépasser 50 caractères",
    }),
    description: z
      .string()
      .nonempty({
        message: "La description ne peut pas être vide",
      })
      .max(200, {
        message: "La description ne doit pas dépasser 200 caractères",
      }),
    timeToAnswer: z
      .number({
        invalid_type_error: "Le temps doit être un nombre",
      })
      .min(1, {
        message: "Le temps doit être supérieur à 0 seconde",
      })
      .max(60, {
        message: "Le temps ne peut pas dépasser 60 secondes",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: quiz.name,
      description: quiz.description ? quiz.description : undefined,
      timeToAnswer: quiz.timeToAnswer,
    },
  });

  const ctx = api.useContext();
  const { mutate, isLoading } = api.quiz.updateMetadata.useMutation({
    onSuccess: async () => {
      await ctx.quiz.getFromUser.invalidate({
        id: quiz.id,
      });
      setOpen(false);
      form.reset({
        name: undefined,
        description: undefined,
        timeToAnswer: undefined,
      });
    },
  });

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow">
      <div className="p-6">
        {/* Image placeholder */}
        <div className="aspect-video h-52 max-w-full rounded-lg bg-black"></div>
        <p className="mt-4 text-xl font-medium">{quiz.name}</p>
        <p className="mt-1 text-sm text-gray-700">
          {quiz.description ?? "Pas de description"}
        </p>
      </div>
      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-center gap-4">
          <TimerIcon className="h-6 w-6" />
          <div className="text-sm">
            <p className="font-medium">Temps pour répondre à chaque question</p>
            <span className="mt-1 text-gray-600">
              {quiz.timeToAnswer} secondes
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Dialog
          open={open}
          onOpenChange={(state) => {
            if (!isLoading) {
              setOpen(state);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Modifier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier les informations du quiz</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                autoComplete="off"
                onSubmit={form.handleSubmit((data) => {
                  mutate({
                    ...data,
                    id: quiz.id,
                  });
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
                <FormField
                  control={form.control}
                  name="timeToAnswer"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Temps de réponse entre les questions
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...form.register("timeToAnswer", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  Modifier
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
