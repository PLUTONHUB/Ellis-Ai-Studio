import { framer } from "@framer/plugin"
import { useState } from "react"
import "./App.css"

framer.showUI({ position: "top right", width: 300, height: 420 })

/**
 * Design exporter.
 *
 * Walks the canvas from the root (or from whatever is selected) and serialises
 * every node — type, name, geometry, layout, typography, colour, links and text
 * — into one JSON document.
 *
 * Rather than reading a hand-written list of properties, it copies every plain
 * own value off each node. Framer's node shape varies by type and version, so
 * enumerating keys ourselves would silently drop whatever we forgot; this way
 * anything Framer exposes ends up in the file.
 */

const MAX_DEPTH = 60

type Json = Record<string, unknown>

/** Keep plain data; drop functions, symbols and anything non-serialisable. */
function plainProps(node: unknown): Json {
  const out: Json = {}
  const seen = new Set<string>()
  let obj = node as Record<string, unknown> | null

  // Walk the prototype chain too — traits often live on the prototype.
  while (obj && obj !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      if (seen.has(key) || key.startsWith("_")) continue
      seen.add(key)
      let value: unknown
      try {
        value = (node as Record<string, unknown>)[key]
      } catch {
        continue
      }
      if (typeof value === "function" || typeof value === "symbol") continue
      if (value === undefined) continue
      try {
        JSON.stringify(value)
        out[key] = value
      } catch {
        /* circular or exotic — skip it rather than fail the whole export */
      }
    }
    obj = Object.getPrototypeOf(obj)
  }
  return out
}

async function callIfPresent<T>(node: unknown, method: string): Promise<T | null> {
  const fn = (node as Record<string, unknown>)[method]
  if (typeof fn !== "function") return null
  try {
    return (await (fn as () => Promise<T>).call(node)) ?? null
  } catch {
    return null
  }
}

async function serialise(node: { id: string }, depth: number, counter: { n: number }): Promise<Json> {
  counter.n += 1
  const record: Json = plainProps(node)

  // Text and measured geometry are behind async getters, not plain properties.
  const text = await callIfPresent<string>(node, "getText")
  if (text !== null) record.text = text
  const rect = await callIfPresent<unknown>(node, "getRect")
  if (rect !== null) record.rect = rect

  if (depth >= MAX_DEPTH) {
    record.truncated = true
    return record
  }

  try {
    const children = await framer.getChildren(node.id)
    if (children.length > 0) {
      record.children = await Promise.all(
        children.map((child) => serialise(child, depth + 1, counter)),
      )
    }
  } catch {
    /* leaf nodes throw rather than returning [] on some node classes */
  }
  return record
}

export function App() {
  const [status, setStatus] = useState("")
  const [busy, setBusy] = useState(false)
  const [json, setJson] = useState<string | null>(null)

  const run = async (fromSelection: boolean) => {
    setBusy(true)
    setStatus("Reading canvas…")
    setJson(null)
    try {
      let roots: { id: string }[]
      if (fromSelection) {
        roots = await framer.getSelection()
        if (roots.length === 0) {
          setStatus("Nothing selected. Select a frame, or export the whole page.")
          setBusy(false)
          return
        }
      } else {
        roots = [await framer.getCanvasRoot()]
      }

      const counter = { n: 0 }
      const tree = await Promise.all(roots.map((r) => serialise(r, 0, counter)))
      const doc = {
        exportedAt: new Date().toISOString(),
        scope: fromSelection ? "selection" : "canvas-root",
        nodeCount: counter.n,
        tree,
      }
      const text = JSON.stringify(doc, null, 2)
      setJson(text)
      setStatus(`${counter.n} nodes · ${(text.length / 1024).toFixed(0)} KB ready`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed.")
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!json) return
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "framer-design-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    if (!json) return
    await navigator.clipboard.writeText(json)
    setStatus("Copied to clipboard.")
  }

  return (
    <main style={{ display: "grid", gap: 10, padding: 12, alignContent: "start" }}>
      <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, opacity: 0.75 }}>
        Exports the design as JSON — layout, type, colour, spacing and text for
        every layer. No images are included.
      </p>

      <button onClick={() => run(false)} disabled={busy}>
        Export whole page
      </button>
      <button onClick={() => run(true)} disabled={busy}>
        Export selection only
      </button>

      {json && (
        <>
          <button onClick={download} style={{ fontWeight: 600 }}>
            Download JSON
          </button>
          <button onClick={copy}>Copy to clipboard</button>
        </>
      )}

      {status && (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, opacity: 0.9 }}>{status}</p>
      )}
    </main>
  )
}
