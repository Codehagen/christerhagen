import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Dekket lå på /no/presentasjon/ai-i-tre-steg før det fikk navn etter salen
   * det holdes i. Lenken er delt muntlig, så den gamle adressen får leve som en
   * videresending. 307 og ikke 308: navnet på et dekk som gjenbrukes kan komme
   * til å endre seg igjen, og en permanent redirect ville lagt seg fast i
   * nettleserne til alle som hadde besøkt den gamle lenken.
   */
  async redirects() {
    return [
      {
        source: "/no/presentasjon/ai-i-tre-steg",
        destination: "/no/presentasjon/Rotary",
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        // RFC 8288 discovery: an agent that fetches any page learns where the
        // sitemap, the machine-readable site guide and the agent instructions
        // are without having to probe well-known paths.
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: [
              '</sitemap.xml>; rel="sitemap"; type="application/xml"',
              '</llms.txt>; rel="describedby"; type="text/plain"',
              '</agents.md>; rel="help"; type="text/markdown"',
              '</index.md>; rel="alternate"; type="text/markdown"',
            ].join(", "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
