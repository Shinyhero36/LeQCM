import Link from "next/link";

export const Logo = ({ ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
  <Link
    href="/"
    className="self-center text-2xl font-semibold"
    {...props}
    prefetch={false}
  >
    Le QCM
  </Link>
);
