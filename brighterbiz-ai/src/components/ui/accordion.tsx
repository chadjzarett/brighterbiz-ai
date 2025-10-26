"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Accordion = ({ className, children, ...props }: AccordionProps) => (
  <div className={cn("w-full space-y-2", className)} {...props}>
    {children}
  </div>
)

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AccordionItem = ({ className, children, ...props }: AccordionItemProps) => (
  <div className={cn("border-b border-primary", className)} {...props}>
    {children}
  </div>
)

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const AccordionTrigger = ({ className, children, isOpen, onToggle, ...props }: AccordionTriggerProps) => (
  <button
    onClick={onToggle}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-primary",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200 ml-2",
        isOpen && "rotate-180"
      )}
    />
  </button>
)

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  children: React.ReactNode
}

const AccordionContent = ({ className, children, isOpen, ...props }: AccordionContentProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all duration-200 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0 text-secondary", className)}>
        {children}
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
