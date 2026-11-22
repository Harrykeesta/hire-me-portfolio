// Cloudflare Worker: serves the static site and handles the contact form.
// POST /api/contact -> checks spam (honeypot + optional Turnstile) -> emails you through
// Cloudflare Email Routing's send_email binding (free). Everything else is a static file.
//
// wrangler.jsonc needs:
//   "send_email": [{ "name": "CONTACT", "destination_address": "<your verified Email Routing address>" }]
//   "vars": { "SITE_NAME": "yourdomain.com", "CONTACT_FROM": "contact@yourdomain.com" }
// and optionally the secret TURNSTILE_SECRET (npx wrangler secret put TURNSTILE_SECRET).
import { EmailMessage } from "cloudflare:email";

const MAX = { name: 120, email: 200, company: 160, message: 5000 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      return contact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function contact(request, env) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (ok, message, status = ok ? 200 : 400) =>
    wantsJson
      ? Response.json({ ok, message }, { status })
      : Response.redirect(new URL(`/?sent=${ok ? "1" : "0"}#contact`, request.url).toString(), 303);

  // Same-site only.
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return reply(false, "Please send the form from the website.", 403);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, "That didn't come through. Please try again.");
  }
  const get = (k) => String(form.get(k) || "").trim();
  const data = { name: get("name"), email: get("email"), company: get("company"), message: get("message") };

  // Honeypot: real people never fill this in. Pretend it worked.
  if (get("website")) return reply(true, "Thanks! I'll get back to you soon.");

  if (!data.name || !data.message) return reply(false, "Please add your name and what's broken.");
  if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(data.email)) return reply(false, "Please check your email address.");
  for (const [k, n] of Object.entries(MAX)) if (data[k].length > n) return reply(false, `Please shorten the ${k} field.`);

  if (env.TURNSTILE_SECRET) {
    const token = get("cf-turnstile-response");
    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get("CF-Connecting-IP") || "" }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!check.success) return reply(false, "The spam check didn't pass. Please try again.");
  }

  if (!env.CONTACT) return reply(false, "The form isn't connected yet. Please email me instead.", 503);

  const site = env.SITE_NAME || new URL(request.url).host;
  const from = env.CONTACT_FROM || `contact@${site}`;
  const subject = `Website: ${oneLine(data.name)}${data.company ? ` (${oneLine(data.company)})` : ""}`;
  const body = [
    `New message from ${site}`,
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    data.company ? `Company: ${data.company}` : "",
    "",
    data.message,
    "",
    "--",
    "Reply to this email to answer them directly.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\r\n");

  const raw = [
    `From: "${site} contact form" <${from}>`,
    `To: <${env.CONTACT_TO || "contact"}>`,
    `Reply-To: ${encodeWord(oneLine(data.name))} <${oneLine(data.email)}>`,
    `Subject: ${encodeWord(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${site}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64(body).replace(/.{1,76}/g, "$&\r\n"),
  ].join("\r\n");

  try {
    await env.CONTACT.send(new EmailMessage(from, env.CONTACT_TO, raw));
  } catch (err) {
    console.error("contact send failed", err?.message);
    return reply(false, "Sending failed on my end. Please email me directly.", 502);
  }
  return reply(true, "Thanks! I'll reply with what it takes and a fixed price.");
}

const oneLine = (s) => String(s).replace(/[\r\n]+/g, " ").slice(0, 200);
const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const encodeWord = (s) => (/^[\x20-\x7e]*$/.test(s) ? s.replace(/"/g, "'") : `=?UTF-8?B?${b64(s)}?=`);
