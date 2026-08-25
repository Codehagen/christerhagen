import type { Metadata } from "next"

import { VectorLab } from "./vector-lab"

export const metadata: Metadata = {
  title: "Vektorlaboratorium",
  description: "Generator for presentasjonsgrafikk — varm vektor.",
  robots: { index: false, follow: false },
}

export default function VectorLabPage() {
  return <VectorLab />
}
