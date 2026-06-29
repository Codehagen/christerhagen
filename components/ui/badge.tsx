import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// One rust outline pill, used for portfolio/exit status (Acquired / Exit / Pre-seed).
// Deliberately a single variant; the site doesn't need a badge taxonomy. Dead
// shadcn variants and aria-invalid/dark surface were removed.
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap",
  {
    variants: {
      variant: {
        status:
          "h-auto rounded-full border border-primary/35 px-[11px] py-[7px] font-mono text-[9.5px] leading-none font-medium tracking-[0.08em] text-primary uppercase",
      },
    },
    defaultVariants: {
      variant: "status",
    },
  }
)

function Badge({
  className,
  variant = "status",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
