import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge does not know the site's named type sizes (app/globals.css
 * `@theme`), and would read `text-body` as a colour and drop it next to
 * `text-ink`. Teach it they are font sizes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "micro",
            "small",
            "ui",
            "body",
            "lead",
            "title",
            "title-lg",
            "pen",
            "pen-lg",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
