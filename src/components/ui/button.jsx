import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/90 shadow-sm shadow-zinc-500/5",
        destructive: "bg-red-500/90 text-white hover:bg-red-500 shadow-sm shadow-red-500/20",
        outline: "border border-zinc-800 bg-transparent hover:bg-zinc-800/50 text-zinc-100",
        secondary: "bg-zinc-800/60 text-zinc-100 hover:bg-zinc-800/80",
        ghost: "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100",
        link: "text-zinc-100 underline-offset-4 hover:underline",
        success: "bg-emerald-500/90 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-500/20",
        warning: "bg-amber-500/90 text-white hover:bg-amber-500 shadow-sm shadow-amber-500/20",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
