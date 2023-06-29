import { Outfit } from "next/font/google";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Head } from "@/components/head";
import { Logo } from "@/components/logo";
import { Phone } from "@/components/phone";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLinkIcon } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Head />
      <div className={cn("min-h-screen", outfit.className)}>
        <header className="flex items-center justify-between p-5">
          <Logo theme="light" />
          <nav className="flex items-center space-x-7">
            <Link
              href="https://clubinfo.insat.fr"
              target="_blank"
              className="hidden gap-2 text-lg font-medium hover:text-turquoise-600 md:inline-flex"
            >
              <span>Club Info INSA Toulouse</span>
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link
                href="#"
                className="rounded-lg bg-turquoise-400 px-4 py-2 text-lg font-medium text-white hover:bg-turquoise-500"
              >
                Créer un quiz
              </Link>
            </SignedOut>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl">
          <section className="flex flex-col items-center justify-center gap-16 px-5 py-20 md:px-24 md:py-24">
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
              className="max-w-3xl space-y-6 text-center"
            >
              <h1 className="text-5xl font-semibold md:text-7.5xl">
                Tester les{" "}
                <span className="text-perano-500">connaissances</span> de votre{" "}
                <span className="text-perano-500">audience.</span>
              </h1>
              <p className="text-xl text-gray-500 md:text-3xl">
                Créez des quiz interactifs pour vos cours et présentations.
              </p>
              <div className="flex justify-center gap-2">
                <Link
                  href="#"
                  className="inline-block rounded-lg bg-turquoise-400 px-4 py-3 text-lg font-medium text-white hover:bg-turquoise-500"
                >
                  Get started
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 250,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0,
              }}
            >
              <Phone>
                {/* TODO: Animate phone screen */}
                <div className="h-full w-full rounded-[37px] bg-white"></div>
              </Phone>
            </motion.div>
          </section>
        </main>
        <footer className="mx-auto max-w-7xl px-8 py-12">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <p>© {year} Le qcm</p>
            <p>
              Un projet développé par le{" "}
              <Link
                href="https://clubinfo.insat.fr"
                target="_blank"
                className="underline underline-offset-4 hover:text-turquoise-600"
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
