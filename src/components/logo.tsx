import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

export const Logo = ({ theme = "light" }: { theme: Theme }) => (
  <div className="flex items-center gap-2">
    <div
      className={cn("h-6 w-6 rounded-full", {
        "bg-black": theme === "light",
        "bg-white": theme === "dark",
      })}
    />
    <p
      className={cn("text-xl font-medium", {
        "text-black": theme === "light",
        "text-white": theme === "dark",
      })}
    >
      Le qcm
    </p>
  </div>
);
