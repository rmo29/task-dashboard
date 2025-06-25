import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "rounded-xl border border-blue-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/60 shadow-inner px-4 py-2 text-base font-medium focus:ring-2 focus:ring-indigo-300 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)] focus:scale-[1.03] transition-all duration-200 placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

export { Input };
