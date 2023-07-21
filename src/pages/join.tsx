import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function JoinPage() {
  const { user } = useUser();

  const formSchema = z.object({
    pin: z
      .string({
        errorMap: () => ({ message: "Le code PIN est requis" }),
      })
      .trim()
      .length(6, "Le code doit contenir 6 chiffres"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: undefined,
    },
  });

  return (
    <div className="relative flex h-screen items-center justify-center">
      <Image
        src="/images/lobby.webp"
        alt="Background"
        fill
        className="object-cover"
      />

      {user && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(console.log, console.error)}
            autoComplete="off"
            className="z-10 w-full max-w-xs space-y-2 rounded-lg bg-white p-4 text-center"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="h-12 text-center text-lg"
                      placeholder="Code PIN"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="h-12 w-full text-lg" type="submit">
              Entrer
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
