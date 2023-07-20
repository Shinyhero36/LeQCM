import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Head } from "@/components/head";
import { Logo } from "@/components/logo";
import { Phone } from "@/components/phone";
import { cn } from "@/lib/utils";
import { GithubIcon } from "lucide-react";

type NavItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const NavItem = ({
  className,
  href,
  target,
  children,
  ...props
}: NavItemProps) => (
  <Link
    className={cn(
      "block py-2 pl-3 pr-4 text-center md:bg-transparent md:p-0 md:text-gray-800 md:dark:text-gray-500",
      className
    )}
    href={href ?? "#"}
    target={target ?? "_self"}
    {...props}
  >
    {children}
  </Link>
);

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Head />
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-lg">
          <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
            <Logo />

            <div className="hidden w-full items-center justify-between md:flex md:w-auto">
              <ul className="flex flex-col font-medium md:flex-row md:space-x-8">
                <li>
                  <NavItem href="/">Acceuil</NavItem>
                </li>
                <li>
                  <NavItem href="#">A Propos</NavItem>
                </li>
                <li>
                  <NavItem href="https://clubinfo.insat.fr" target="_blank">
                    Club Info
                  </NavItem>
                </li>
              </ul>
            </div>

            <Link href="/app" className={cn(buttonVariants(), "mr-3")}>
              Dashboard
            </Link>
          </div>
        </nav>
        {/* Hero */}
        <section className="min-h-screen bg-gray-50 pt-12 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl text-center">
              {/* Pill */}
              <div className="flex justify-center">
                <span className="flex items-center justify-center rounded-full bg-indigo-100 px-5 py-1.5 text-sm font-medium text-indigo-800">
                  Un projet du Club Info
                </span>
              </div>

              <h1 className="font-display mt-5 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                Une plateforme quiz interactive
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-gray-700 sm:text-lg md:text-xl lg:text-2xl ">
                Le QCM est une plateforme de quiz interactive open-source et
                gratuite sans paywall.
              </p>
              <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  className={cn(buttonVariants({ size: "xl" }), "text-base")}
                  href="/app"
                >
                  Crée un quiz
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "xl", variant: "outline" }),
                    "text-base"
                  )}
                  href="#"
                >
                  Rejoindre un quiz
                </Link>
              </div>
            </div>

            <div className="my-16 flex justify-center">
              <Phone>
                <div className="h-full w-full rounded-[37px] bg-white"></div>
              </Phone>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="mx-auto max-w-7xl space-y-16 border-t px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Logo />
                <p className="text-sm text-gray-500">
                  © {year} Un projet du Club Info.
                </p>
              </div>
              <Link
                href="#"
                className={cn(
                  buttonVariants({ size: "icon" }),
                  "bg-transparent text-black shadow-none hover:bg-transparent"
                )}
              >
                <GithubIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
