import { describe, expect, it } from "vitest"
import {
  SITE_URL,
  siteUrl,
  personGraph,
  organizationLd,
  blogPostingLd,
  breadcrumbLd,
} from "@/lib/seo"
import sitemap from "@/app/sitemap"
import robots from "@/app/robots"
import { companyOrder } from "@/lib/companies"
import { postOrder } from "@/lib/posts"

const APEX_NO_WWW = /https:\/\/christerhagen\.com/

describe("SITE_URL", () => {
  it("is the www canonical host", () => {
    expect(SITE_URL).toBe("https://www.christerhagen.com")
  })

  it("siteUrl prefixes paths with SITE_URL", () => {
    expect(siteUrl("/about")).toBe("https://www.christerhagen.com/about")
    expect(siteUrl()).toBe(SITE_URL)
  })
})

describe("sitemap()", () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)

  it("every url starts with the www SITE_URL", () => {
    for (const url of urls) {
      expect(url.startsWith(SITE_URL)).toBe(true)
    }
  })

  it("never uses the bare apex without www", () => {
    for (const url of urls) {
      // strip the www host, then ensure no bare apex remains
      const rest = url.replace(SITE_URL, "")
      expect(APEX_NO_WWW.test(rest)).toBe(false)
    }
  })

  it("covers every static route incl /brand", () => {
    const staticPaths = [
      "/",
      "/about",
      "/portfolio",
      "/writing",
      "/process",
      "/brand",
      "/contact",
    ]
    for (const path of staticPaths) {
      expect(urls).toContain(siteUrl(path))
    }
  })

  it("covers every portfolio company slug", () => {
    for (const slug of companyOrder) {
      expect(urls).toContain(siteUrl("/portfolio/" + slug))
    }
  })

  it("covers every writing post slug", () => {
    for (const slug of postOrder) {
      expect(urls).toContain(siteUrl("/writing/" + slug))
    }
  })
})

describe("robots()", () => {
  it("sitemap field starts with the www SITE_URL", () => {
    const r = robots()
    expect(typeof r.sitemap).toBe("string")
    expect((r.sitemap as string).startsWith(SITE_URL)).toBe(true)
  })
})

describe("personGraph()", () => {
  const graph = personGraph()
  const json = JSON.stringify(graph)

  it("never emits the bare apex without www", () => {
    expect(APEX_NO_WWW.test(json)).toBe(false)
  })

  it("Person @id is SITE_URL + /#christer", () => {
    const nodes = (graph as { "@graph": Array<Record<string, unknown>> })[
      "@graph"
    ]
    const person = nodes.find((n) => n["@type"] === "Person")
    expect(person).toBeDefined()
    expect(person!["@id"]).toBe(SITE_URL + "/#christer")
  })

  it("Person has 4 sameAs entries", () => {
    const nodes = (graph as { "@graph": Array<Record<string, unknown>> })[
      "@graph"
    ]
    const person = nodes.find((n) => n["@type"] === "Person")!
    expect(Array.isArray(person.sameAs)).toBe(true)
    expect((person.sameAs as string[]).length).toBe(4)
  })

  it("Person has image and knowsAbout", () => {
    const nodes = (graph as { "@graph": Array<Record<string, unknown>> })[
      "@graph"
    ]
    const person = nodes.find((n) => n["@type"] === "Person")!
    expect(typeof person.image).toBe("string")
    expect((person.image as string).startsWith(SITE_URL)).toBe(true)
    expect(Array.isArray(person.knowsAbout)).toBe(true)
    expect((person.knowsAbout as string[]).length).toBeGreaterThan(0)
  })
})

describe("organizationLd()", () => {
  it("docdir has parentOrganization Visma", () => {
    const ld = organizationLd("docdir") as Record<string, unknown>
    expect(ld.parentOrganization).toBeDefined()
    expect(
      (ld.parentOrganization as { name: string }).name
    ).toBe("Visma")
  })

  it("a founder-role company has founder @id #christer", () => {
    const ld = organizationLd("codebase") as Record<string, unknown>
    expect(ld.founder).toEqual({ "@id": SITE_URL + "/#christer" })
  })
})

describe("blogPostingLd()", () => {
  it("docdir-visma has datePublished and author @id #christer", () => {
    const ld = blogPostingLd("docdir-visma") as Record<string, unknown>
    expect(ld.datePublished).toBe("2026-02-15")
    expect(ld.author).toEqual({ "@id": SITE_URL + "/#christer" })
  })
})

describe("breadcrumbLd()", () => {
  it("uses www item URLs", () => {
    const ld = breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/writing" },
    ]) as Record<string, unknown>
    const items = ld.itemListElement as Array<Record<string, unknown>>
    expect(items.length).toBe(2)
    expect(items[0].position).toBe(1)
    expect(items[1].position).toBe(2)
    for (const item of items) {
      expect((item.item as string).startsWith(SITE_URL)).toBe(true)
    }
  })
})
