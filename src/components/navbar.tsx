import { SignedIn, UserButton } from "@clerk/nextjs";

export const NavBar = () => {
  return (
    <header className="z-40 border-b">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-xl text-black">Le QCM</p>
          </div>
          <SignedIn>
            <UserButton showName afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
