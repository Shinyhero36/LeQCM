import { Merriweather_Sans, Mukta_Vaani } from "next/font/google";
import { Head } from "@/components/head";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { metadata } from "@/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
});

const muktaVaani = Mukta_Vaani({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const year = new Date().getFullYear();
  return (
    <>
      <Head />
      <div className={cn("min-h-screen bg-cod-950")}>
        <header className="mx-auto max-w-7xl px-8">
          <div className="flex items-center justify-between py-8">
            <Logo theme="dark" />
            <SignedIn>
              <UserButton
                showName
                appearance={{
                  elements: {
                    //
                    userButtonOuterIdentifier: {
                      color: "white",
                    },
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton redirectUrl="/dashboard">
                <Button>Se connecter</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-6 sm:px-10 sm:py-32">
          <div className="space-y-16 lg:grid lg:grid-cols-12 lg:space-x-8 lg:space-y-0">
            <div className="col-span-8 space-y-6 lg:space-y-12">
              <motion.p
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                }}
                className={`font-semibold uppercase tracking-wide text-perano-400`}
              >
                En cours de développement
              </motion.p>
              <motion.h1
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
                className={`max-w-4xl text-4xl font-extrabold leading-none text-white sm:text-5xl lg:text-7xl ${merriweatherSans.className}`}
              >
                Une moyen <span className="text-perano-400">ludique</span> de
                tester les{" "}
                <span className="text-perano-400">connaissances</span> de votre
                audience
              </motion.h1>
              <motion.p
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                }}
                className={`max-w-2xl text-xl text-gray-400 sm:text-2xl ${muktaVaani.className}`}
              >
                Le qcm est une plateforme qui vous permet de créer des quiz
                interactifs en compléments de vos présentations et vos cours.
              </motion.p>
              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                }}
                className="flex space-x-4"
              >
                <button className="rounded-md bg-perano-400 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-perano-500 lg:px-8 lg:py-4 lg:text-lg">
                  Rejoindre la beta
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{
                x: 100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
                duration: 0.5,
              }}
              className="relative hidden justify-center sm:flex lg:col-span-4 lg:justify-start"
            >
              <Image
                className="shadow-perano-300 drop-shadow-lg filter"
                src="/images/phone.png"
                width={300}
                height={607}
                alt="Preview"
              />
            </motion.div>
          </div>
        </main>
        <footer className="mx-auto max-w-7xl px-8 py-12 text-white">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <p>© {year} Le qcm</p>
            <p>
              Un projet développé par le{" "}
              <Link
                href="https://clubinfo.insat.fr"
                target="_blank"
                className="underline underline-offset-4"
              >
                Club Info
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
