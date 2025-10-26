import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - all buttons
  `
    inline-flex items-center justify-center gap-2
    font-medium
    transition-all duration-200
    focus-visible:outline-none
    focus-visible:ring-4
    disabled:pointer-events-none
    disabled:opacity-50
    whitespace-nowrap
    [&_svg]:pointer-events-none
    [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        // Primary - Black/White (main CTAs)
        primary: `
          bg-black text-white
          dark:bg-white dark:text-black
          hover:bg-gray-800 dark:hover:bg-gray-100
          focus-visible:ring-gray-500/50
          active:scale-[0.98]
        `,

        // Secondary - Subtle gray (less important actions)
        secondary: `
          bg-tertiary text-primary
          border border-primary
          hover:bg-hover
          focus-visible:ring-gray-500/30
        `,

        // Ghost - Transparent (tertiary actions)
        ghost: `
          text-secondary
          hover:bg-hover hover:text-primary
          focus-visible:ring-gray-500/30
        `,

        // Destructive - Red (dangerous actions)
        destructive: `
          bg-red-600 text-white
          hover:bg-red-700
          focus-visible:ring-red-500/50
        `,

        // Outline - Border only
        outline: `
          border border-primary
          bg-transparent text-primary
          hover:bg-tertiary
          focus-visible:ring-gray-500/30
        `,

        // Link - Text only
        link: `
          text-blue-600
          hover:underline
          focus-visible:ring-blue-500/30
        `,
      },

      size: {
        sm: 'h-9 px-3 text-sm rounded-lg',      // 36px height
        md: 'h-10 px-4 text-sm rounded-lg',     // 40px height (default)
        lg: 'h-11 px-6 text-base rounded-lg',   // 44px height
        xl: 'h-12 px-8 text-base rounded-lg',   // 48px height
        icon: 'h-10 w-10 rounded-lg',           // Square icon button
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
