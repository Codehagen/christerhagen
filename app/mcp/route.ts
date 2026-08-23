import { TOOLS, TOOLS_BY_NAME } from "@/lib/mcp-tools"
import { SITE_URL } from "@/lib/seo"

/**
 * MCP server over this site's own content, Streamable HTTP transport.
 *
 * Hand-rolled rather than pulled from the SDK: the surface is one POST endpoint
 * speaking JSON-RPC 2.0 with six read-only tools, and a dependency would be
 * more code than this, not less. No auth, because there is nothing here that is
 * not already public.
 */

const PROTOCOL_VERSION = "2025-06-18"

const SERVER_INFO = {
  name: "christerhagen",
  title: "Christer Hagen",
  version: "1.0.0",
  websiteUrl: SITE_URL,
}

const JSONRPC_ERRORS = {
  parse: -32700,
  invalidRequest: -32600,
  methodNotFound: -32601,
  invalidParams: -32602,
  internal: -32603,
} as const

type Id = string | number | null

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      // The transport is a single POST endpoint; say so rather than making a
      // client discover it by trial.
      "mcp-protocol-version": PROTOCOL_VERSION,
    },
  })
}

function result(id: Id, value: unknown) {
  return json({ jsonrpc: "2.0", id, result: value })
}

function error(id: Id, code: number, message: string, data?: unknown) {
  return json({
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data === undefined ? {} : { data }) },
  })
}

/** A tool that throws reports through `isError`, not a JSON-RPC error — the
 *  model is supposed to see the message and correct its own call. */
function toolFailure(id: Id, message: string) {
  return result(id, {
    content: [{ type: "text", text: message }],
    isError: true,
  })
}

function handle(method: string, params: Record<string, unknown>, id: Id) {
  switch (method) {
    case "initialize":
      return result(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Read-only access to christerhagen.com, the personal site of Christer Hagen. " +
          "Use get_profile to verify identity facts, list_ventures to tell companies he founded " +
          "apart from companies he only backed, and search_site or get_page for anything else. " +
          "Every page is also fetchable as markdown over plain HTTP by appending .md.",
      })

    case "ping":
      return result(id, {})

    case "tools/list":
      return result(id, {
        tools: TOOLS.map(({ name, title, description, inputSchema, annotations }) => ({
          name,
          title,
          description,
          inputSchema,
          annotations,
        })),
      })

    case "tools/call": {
      const name = params.name
      if (typeof name !== "string") {
        return error(id, JSONRPC_ERRORS.invalidParams, 'Missing tool name in "name".')
      }
      const tool = TOOLS_BY_NAME.get(name)
      if (!tool) {
        return error(
          id,
          JSONRPC_ERRORS.invalidParams,
          `Unknown tool "${name}". Call tools/list for the available tools.`
        )
      }
      const args =
        params.arguments && typeof params.arguments === "object"
          ? (params.arguments as Record<string, unknown>)
          : {}
      try {
        const text = tool.run(args)
        return result(id, { content: [{ type: "text", text }] })
      } catch (cause) {
        return toolFailure(id, cause instanceof Error ? cause.message : String(cause))
      }
    }

    default:
      return error(id, JSONRPC_ERRORS.methodNotFound, `Unknown method "${method}".`)
  }
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return error(null, JSONRPC_ERRORS.parse, "Request body is not valid JSON.")
  }

  // Batches are legal JSON-RPC; handle them rather than 400ing a valid client.
  const single = !Array.isArray(payload)
  const messages = (single ? [payload] : payload) as unknown[]

  const responses = []
  for (const message of messages) {
    if (!message || typeof message !== "object") {
      responses.push({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: JSONRPC_ERRORS.invalidRequest,
          message: "Each JSON-RPC message must be an object.",
        },
      })
      continue
    }
    const { method, params, id } = message as {
      method?: unknown
      params?: unknown
      id?: Id
    }
    if (typeof method !== "string") {
      responses.push({
        jsonrpc: "2.0",
        id: id ?? null,
        error: {
          code: JSONRPC_ERRORS.invalidRequest,
          message: 'Missing "method".',
        },
      })
      continue
    }
    // Notifications carry no id and get no response.
    if (id === undefined) continue

    const response = handle(
      method,
      (params && typeof params === "object" ? params : {}) as Record<string, unknown>,
      id
    )
    responses.push(await response.json())
  }

  if (responses.length === 0) return new Response(null, { status: 202 })
  return json(single ? responses[0] : responses)
}

/**
 * The transport is POST-only. A GET would be the SSE stream for server-initiated
 * messages, and this server never initiates any — so say that plainly instead of
 * holding a connection open that will never carry anything.
 */
export function GET() {
  return json(
    {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: JSONRPC_ERRORS.invalidRequest,
        message:
          "This MCP server speaks Streamable HTTP over POST only; it never initiates messages, so there is no SSE stream to open.",
        data: { endpoint: SITE_URL + "/mcp", protocolVersion: PROTOCOL_VERSION },
      },
    },
    405
  )
}
