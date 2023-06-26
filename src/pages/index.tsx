import Head from "next/head";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center">
        <SignInButton redirectUrl="/dashboard" />
        <SignUpButton redirectUrl="/dashboard" />
      </main>
    </>
  );
}
