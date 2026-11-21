# Hire-me portfolio

A one-page personal website for job hunting, written in your own voice: a round photo and your name up top, what roles you want, your track record in numbers, how you got here, a few short stories from work, how you work, an about-me, short projects you take on freelance sites, and a contact section. Built to get you hired.

- **Free to host.** It runs on Cloudflare Workers as static files: no server, no database, no monthly bill. Only the domain costs money (about $10 a year for a `.com`).
- **One file to edit.** Everything on the page comes from `content.js`.
- **Private by design.** Your `content.js`, resume and headshot are in `.gitignore`, and `npm run check-template` checks the files you would publish for your name, email, domain and employers. Run it before you push.
- **No ads, no tracking, no cookies.** Your email is assembled in the browser so basic scrapers can't pick it up.
- **Works everywhere.** Phones from 320px wide up, light and dark mode, keyboard and screen readers.

## Make it yours

You need Node 18 or newer and a free Cloudflare account.

```bash
npm install
cp content.example.js content.js
cp wrangler.example.jsonc wrangler.jsonc
```

1. Edit `content.js`: your name, headline, roles you want, numbers, stories, links.
2. Put your resume in `public/` (for example `public/resume.pdf`) and set `person.resume` to `/resume.pdf`.
3. Optional: a square headshot in `public/headshot.jpg` (set `person.photo` to `/headshot.jpg`) and a 1200×630 link preview image at `public/og.png`. Set `site.photoPlaceholders` to `false` before you go live.
4. Preview at http://localhost:8787:

```bash
npm run dev
```

## Put it online

```bash
npx wrangler login
npm run deploy
```

Your site is live at `portfolio.<your-subdomain>.workers.dev`.

## Add your domain

1. Buy your domain anywhere (Cloudflare Registrar sells at cost). If you bought it elsewhere, add it to Cloudflare (**Add a domain**, Free plan) and change its nameservers at your registrar to the two Cloudflare shows you.
2. In `wrangler.jsonc` (your private copy), uncomment the `routes` block and put in your domain.
3. Set `site.url` in `content.js` to `https://yourdomain.com`.
4. Run `npm run deploy`. Cloudflare adds the DNS records and the HTTPS certificate for you.

## Freelance links

In `content.js` under `services.platforms`, paste each profile link (Upwork, Fiverr and so on). Any platform without a link shows as "soon" until you add one.

## License

MIT. Use it, change it, share it.
