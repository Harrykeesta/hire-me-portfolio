# Hire-me portfolio

A one-page personal website for job hunting, written in your own voice: a round photo and your name up top, where to hire you (Upwork, Fiverr or direct), what you fix, how a project works, your track record in numbers, short stories from work, how you got here, an about-me, and a contact section. Built for consultants and job seekers alike.

- **Free to host.** It runs on Cloudflare Workers as static files: no server, no database, no monthly bill. Only the domain costs money (about $10 a year for a `.com`).
- **One file to edit.** Everything on the page comes from `content.js`.
- **Private by design.** Your `content.js`, resume and headshot are in `.gitignore`, and `npm run check-template` checks the files you would publish for your name, email, domain and employers. Run it before you push.
- **No ads, no tracking, no cookies.** Your email is assembled in the browser so basic scrapers can't pick it up.
- **Works everywhere.** Phones from 320px wide up, light and dark mode, keyboard and screen readers.

## Make it yours

Click **Use this template** at the top of this page (or fork it) to get your own copy, then clone it. You need Node 18 or newer and a free Cloudflare account.

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

In `content.js` under `platforms.items`, paste each profile link (Upwork, Fiverr and so on). A platform without a link shows as "Profile coming soon"; once it has one, it becomes a button in the hire-me cards, the top of the page and the contact section.

## License

MIT. Use it, change it, share it.
