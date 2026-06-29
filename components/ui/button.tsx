import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The site's button vocabulary is exactly two pills. Kept deliberately small —
// restraint is the brand. Dead shadcn defaults (other variants/sizes, dark:,
// aria-invalid:, disabled-opacity, icon rules) were removed; add a variant
// only when a real second use appears.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-mono text-sm font-medium tracking-[0.02em] whitespace-nowrap transition-[color,background-color,border-color,transform] duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.97]",
  {
    variants: {
      variant: {
        // Dark pill CTA (Get in touch / View portfolio): ink fill, paper text, hover to deep rust.
        pill: "bg-foreground text-background hover:bg-(--rust-deep)",
        // Outline pill CTA (How I work): soft border, ink text, hover to ink border.
        "pill-outline":
          "border-(--line-strong) bg-transparent text-foreground hover:border-foreground",
      },
      size: {
        pill: "h-auto px-[22px] py-[14px] text-[13px]",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "pill",
    },
  }
)

function Button({
  className,
  variant = "pill",
  size = "pill",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
