import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type PhoneProps = React.HTMLAttributes<HTMLDivElement>;

export const Phone = forwardRef<React.ElementRef<"div">, PhoneProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-[595px] w-72 items-center justify-center overflow-hidden rounded-[46px] bg-black p-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Phone.displayName = "Phone";
