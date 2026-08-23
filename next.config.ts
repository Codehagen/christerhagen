import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
