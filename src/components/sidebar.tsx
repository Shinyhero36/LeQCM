import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignOutButton, useUser } from "@clerk/nextjs";
import type { Quiz } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FileTextIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  quizzes?: Quiz[];
}

export const Sidebar = ({ className, quizzes, ...props }: SidebarProps) => {
  const { user } = useUser();
  const router = useRouter();

  const goToHomePage = () => router.push("/");

  return (
    <aside
      className={cn(
        "hidden h-full w-64 flex-col justify-between md:flex lg:w-72",
        className
      )}
      {...props}
    >
      <div>
        {/* Logo */}
        <div className="w-full px-8 py-6 text-2xl font-semibold tracking-tight">
          <Link href="#">Le QCM</Link>
        </div>
        {/* Workspace section */}
        <div className="px-6 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Général
          </h2>
          <div className="space-y-1">
            <Link href="/app">
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start font-normal hover:bg-stone-300"
                )}
              >
                <LayoutDashboardIcon className="h-4 w-4" />
                <span className="ml-2">Dashboard</span>
              </div>
            </Link>
            <Link href="/settings">
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start font-normal hover:bg-stone-300"
                )}
              >
                <SettingsIcon className="h-4 w-4" />
                <span className="ml-2">Paramètres</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Quizz */}
        {quizzes && (
          <div className="px-6 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Mes quiz
            </h2>
            <div className="space-y-1">
              {quizzes.map((quiz) => (
                <Link href={`/app/quiz/${quiz.id}/edit`} key={quiz.id}>
                  <div
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start font-normal hover:bg-stone-300"
                    )}
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span className="ml-2">{quiz.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user && (
            <div className="mx-6 mb-6">
              <Button
                variant="ghost"
                className="h-auto w-full justify-start px-2 text-left hover:bg-stone-300"
              >
                <Image
                  src={user.imageUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="ml-2 flex flex-col justify-center">
                  <span className="text-sm font-medium">{user.fullName}</span>
                  {user.primaryEmailAddress && (
                    <span className="text-xs text-stone-500">
                      {user.primaryEmailAddress.emailAddress}
                    </span>
                  )}
                </div>
              </Button>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[16rem]">
          <SignOutButton signOutCallback={goToHomePage}>
            <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
};
