import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

interface CreateQuestionDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  quizId: string;
}

export const CreateQuestionDialog = ({
  open,
  setOpen,
  quizId,
}: CreateQuestionDialogProps) => {
  const formSchema = z
    .object({
      question: z.string().nonempty("Une question ne peut pas être vide"),
      propositions: z
        .object({
          proposition: z
            .string()
            .min(1, "La proposition ne peux pas être vide")
            .max(120, "Max 120 caractères"),
          isCorrect: z.boolean(),
        })
        .array()
        .min(1, {
          message: "Il faut au moins une proposition",
        })
        .max(4, {
          message: "Il ne peut pas y avoir plus de 4 propositions",
        }),
    })
    .superRefine((val, ctx) => {
      if (val.propositions.every((prop) => !prop.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Il faut au moins une bonne réponse",
          path: ["propositions"],
        });
      }
    });

  const ctx = api.useContext();
  const { mutate, isLoading } = api.quiz.addQuestion.useMutation({
    onSuccess: async () => {
      await ctx.quiz.getFromUser.invalidate({ id: quizId });
      setOpen(false);
      form.reset({
        propositions: Array(2).fill({
          proposition: "",
          isCorrect: false,
        }),
        question: "",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propositions: Array(2).fill({
        proposition: "",
        isCorrect: false,
      }),
    },
  });

  const propositionForm = useFieldArray({
    control: form.control,
    name: "propositions",
  });

  const nbPropositions = form.watch("propositions");

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isLoading) {
          setOpen(state);
          form.reset();
        }
      }}
    >
      <DialogContent className="mt-8 max-h-screen overflow-scroll sm:mt-0 lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajouter une question</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit((data) => {
              mutate({
                ...data,
                quizId,
              });
              // console.log(data);
            })}
            className="mb-16 space-y-4 sm:mb-0"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-52 text-center text-lg placeholder:text-gray-400 sm:text-2xl"
                      placeholder="Tapez votre question ici"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {propositionForm.fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`propositions.${index}.proposition` as const}
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Proposition {index + 1}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Tapez votre proposition ici"
                            className="h-40 w-full text-center text-lg placeholder:text-gray-400"
                            {...field}
                          />
                          <div className="absolute right-0 top-0 flex space-x-2 p-4">
                            {nbPropositions.length > 2 && (
                              <Button
                                className="w-9 p-0"
                                variant="outline"
                                title="Supprimer cette proposition"
                                onClick={() => propositionForm.remove(index)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            )}

                            <FormField
                              control={form.control}
                              name={`propositions.${index}.isCorrect` as const}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div
                                      className={cn(
                                        buttonVariants({
                                          variant: "outline",
                                        }),
                                        "space-x-1 p-2"
                                      )}
                                    >
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(value) =>
                                          field.onChange(value as boolean)
                                        }
                                        id={`proposition.${index}`}
                                      />
                                      <Label htmlFor={`proposition.${index}`}>
                                        Bonne réponse
                                      </Label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {form.formState.errors.propositions && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                          {form.formState.errors.propositions.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                disabled={nbPropositions.length === 4}
                onClick={() =>
                  propositionForm.append({
                    proposition: "",
                    isCorrect: false,
                  })
                }
              >
                Ajouter une proposition
              </Button>

              <Button type="submit" disabled={isLoading}>
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
