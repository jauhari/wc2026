#!/usr/bin/env node
/**
 * Provision Cloudflare Web Analytics for wc2026.ponjong.workers.dev
 * and write NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN to .env.local
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const ACCOUNT_ID = "90d799d642a9813692459fd3b9d403b4"
const HOST = "wc2026.ponjong.workers.dev"
const ROOT = path.resolve(import.meta.dirname, "..")
const ENV_LOCAL = path.join(ROOT, ".env.local")

function readWranglerToken() {
  const candidates = [
    path.join(os.homedir(), ".wrangler", "config", "default.toml"),
    path.join(
      os.homedir(),
      "AppData",
      "Roaming",
      "xdg.config",
      ".wrangler",
      "config",
      "default.toml"
    ),
  ]

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, "utf8")
    const match = text.match(/oauth_token\s*=\s*"([^"]+)"/)
    if (match?.[1]) return match[1]
  }

  throw new Error("Wrangler OAuth token not found. Run: npx wrangler login")
}

async function cfFetch(url, token, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.errors?.[0]?.message ?? `API error ${res.status}`)
  }
  return data
}

async function listSites(token) {
  const data = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info/list`,
    token,
    { method: "GET" }
  )
  return data.result ?? []
}

async function createSite(token) {
  const data = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ host: HOST, auto_install: false }),
    }
  )
  return data.result
}

function upsertEnvLocal(token) {
  const key = "NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN"
  const line = `${key}=${token}`
  let content = ""

  if (fs.existsSync(ENV_LOCAL)) {
    content = fs.readFileSync(ENV_LOCAL, "utf8")
    const re = new RegExp(`^${key}=.*$`, "m")
    content = re.test(content)
      ? content.replace(re, line)
      : `${content.trimEnd()}\n${line}\n`
  } else {
    content = `${line}\n`
  }

  fs.writeFileSync(ENV_LOCAL, content)
}

async function main() {
  const oauth = readWranglerToken()
  const sites = await listSites(oauth)
  let site = sites.find((s) => s.rules?.some((r) => r.host === HOST))

  if (!site) {
    console.log(`Creating Web Analytics site for ${HOST}...`)
    site = await createSite(oauth)
  } else {
    console.log(`Web Analytics site already exists for ${HOST}`)
  }

  const siteToken = site.site_token
  if (!siteToken) {
    throw new Error("No site_token returned from Cloudflare API")
  }

  upsertEnvLocal(siteToken)
  console.log("Saved NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN to .env.local")
  console.log(
    "Dashboard: https://dash.cloudflare.com/?to=/:account/web-analytics"
  )
}

main().catch((err) => {
  const msg = err.message ?? String(err)
  if (msg.includes("Authentication error") || msg.includes("10000")) {
    console.log("API token tidak punya akses Web Analytics.")
    console.log("Setup manual:")
    console.log("1. Buka https://dash.cloudflare.com/?to=/:account/web-analytics")
    console.log("2. Add a site → hostname: wc2026.ponjong.workers.dev")
    console.log("3. Manage site → salin site token")
    console.log("4. Tambahkan ke .env.local:")
    console.log("   NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN=<token>")
    console.log("5. Rebuild & deploy: npm run build:cf && npm run deploy:cf")
    process.exit(0)
  }
  console.error(msg)
  process.exit(1)
})