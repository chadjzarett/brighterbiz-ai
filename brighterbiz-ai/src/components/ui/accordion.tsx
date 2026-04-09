"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Accordion = ({ className, children, ...props }: AccordionProps) => (
  <div className={cn("w-full space-y-3", className)} {...props}>
    {children}
  </div>
)

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AccordionItem = ({ className, children, ...props }: AccordionItemProps) => (
  <div
    className={cn(
      "rounded-2xl border border-primary bg-primary transition-all duration-300",
      "hover:border-secondary hover:shadow-sm",
      className
    )}
    {...props}
  >
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
      "flex w-full items-center justify-between px-6 py-5 text-left font-medium transition-colors duration-200",
      "hover:text-primary",
      isOpen && "pb-2",
      className
    )}
    aria-expanded={isOpen}
    {...props}
  >
    {children}
    <div
      className={cn(
        "ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
        isOpen
          ? "bg-accent/10 rotate-180"
          : "bg-tertiary"
      )}
    >
      <ChevronDown className="h-4 w-4 text-secondary" />
    </div>
  </button>
)

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  children: React.ReactNode
}

const AccordionContent = ({ className, children, isOpen }: AccordionContentProps) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className={cn("px-6 pb-5 pt-1 text-[15px] leading-relaxed text-secondary max-w-prose", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
