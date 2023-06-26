import { UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

export default function Dashboard() {
  const { user } = useUser();
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center">
        {user?.fullName}
        <UserButton afterSignOutUrl="/" />
      </main>
    </>
  );
}
