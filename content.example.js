// Sample content for the template. Copy this file to content.js and make it yours:
//   cp content.example.js content.js
// content.js is ignored by git, so your details never land in a public repo.
// Everyone and everything below is made up.

export default {
  site: {
    url: "https://example.com",
    title: "Jordan Avery | Product Consultant",
    description:
      "Hi, I'm Jordan: product leader in Denver. I turn messy customer problems into products people love to use.",
    monogram: "JA",
    // true = no headshot yet shows a labeled "Photo of you" spot (good while you're building).
    // false = no headshot shows your monogram instead.
    photoPlaceholders: true,
  },

  person: {
    name: "Jordan Avery",
    hello: "Hi, I'm",
    role: "Product Consultant",
    headline: "I turn messy customer problems into products people love to use.",
    intro: [
      "Write two or three sentences about how you got here. Keep it in your own voice, like you'd say it over coffee.",
      "Then one sentence about what ties your work together.",
    ],
    location: "Denver, Colorado",
    region: "Denver, CO",
    timezone: "Mountain Time",
    email: "hello@example.com",
    linkedin: "https://www.linkedin.com/",
    resume: "/resume.pdf",
    // Photos go in public/. Example: put headshot.jpg in public/ and set photo: "/headshot.jpg".
    photo: "",
    photoHint: "Headshot · square · 800 × 800",
  },

  now: {
    status: "Taking new clients",
    text: "Fixed-price quotes and a written scope before I start. Remote anywhere in the U.S.",
  },

  // Where clients can hire you. Empty links show as "Profile coming soon".
  platforms: {
    title: "Hire me where you already work",
    intro: "Book me through a freelance site you trust, or email me directly.",
    items: [
      { name: "Upwork", url: "", best: "Best for bigger projects, hourly or fixed price." },
      { name: "Fiverr", url: "", best: "Best for fixed packages you can start today." },
    ],
  },

  process: {
    title: "How it works",
    steps: [
      { title: "Tell me the problem", body: "A few sentences is enough." },
      { title: "Get a fixed price", body: "A written scope and a price, before any work starts." },
      { title: "I deliver and document it", body: "Updates as I go, and notes your team can use." },
    ],
  },

  clients: {
    title: "Teams I've worked with",
    names: ["Example SaaS Co.", "Example Startup", "Example Agency"],
  },

  impact: [
    { value: "40%", label: "faster customer onboarding", context: "B2B SaaS, 2,000 accounts" },
    { value: "$3M", label: "ARR from a new self-serve plan", context: "launched in 9 months" },
    { value: "500+", label: "customer interviews", context: "SMB and enterprise" },
    { value: "12", label: "products shipped", context: "web, mobile and API" },
    { value: "4", label: "product managers hired and coached", context: "two promoted" },
    { value: "99.9%", label: "uptime on the billing platform", context: "after the rebuild" },
  ],

  journey: [
    { when: "2012–2016", title: "Designer", body: "Where you started and what it taught you." },
    { when: "2016–2020", title: "Product manager", body: "The jump into product and your first big win." },
    { when: "2020–now", title: "Product leader", body: "What you lead today and who you lead." },
  ],

  stories: [
    {
      id: "onboarding",
      tab: "Customers who never got started",
      where: "Example SaaS Co. · 2022–2024",
      title: "Customers who never got started",
      short: "A third of new customers never finished setup. A year later, onboarding was 40% faster.",
      flow: ["Sign up", "Import data", "Invite team", "First report", "Paid plan"],
      parts: [
        { h: "What was going on", p: "Describe the problem the way the customer felt it." },
        { h: "What I did", p: "Two or three sentences on what you did and who you brought along." },
        { h: "How it turned out", p: "The result, with a number if you have one." },
        { h: "What I took away", p: "One honest lesson." },
      ],
    },
    {
      id: "self-serve",
      tab: "A plan that sold itself",
      where: "Example Startup · 2020–2022",
      title: "A plan that sold itself",
      short: "Every customer had to talk to sales. We launched self-serve and it reached $3M ARR.",
      parts: [
        { h: "What was going on", p: "Growth was capped by the size of the sales team." },
        { h: "What I did", p: "Worked with finance on pricing and built a checkout with no sales call." },
        { h: "How it turned out", p: "$3M ARR in 18 months, and sales focused on big deals." },
        { h: "What I took away", p: "Price is part of the product." },
      ],
    },
  ],

  principles: [
    { title: "Talk to people first", body: "I don't plan anything until I've heard the problem from the people who live with it." },
    { title: "Write it down", body: "Everyone should know what's next and who owns it." },
    { title: "Ship on a steady beat", body: "Small releases every week build more trust than one big launch." },
  ],

  ai: {
    intro: "I use AI to speed up the slow parts of product work. A person still owns every decision.",
    items: [
      { title: "Faster research", body: "Turning interview notes into themes the same day." },
      { title: "First drafts", body: "Drafting user stories and acceptance criteria for the team to review." },
      { title: "Show, don't tell", body: "Clickable mockups before anyone writes production code." },
    ],
  },

  about: {
    paragraphs: [
      "Where you live, your background and education, in a sentence or two.",
      "Something about how you like to work, or what makes you smile at work.",
    ],
    offClock: ["A hobby", "A team you cheer for", "Something you're learning"],
  },

  services: {
    title: "What I do",
    intro: "Each project gets a clear scope and a fixed price.",
    items: [
      { title: "Product audit", body: "A two-week review of your product, roadmap and metrics.", fit: "Good fit if growth stalled and nobody agrees why.", tools: "Analytics · Interviews" },
      { title: "Roadmap reset", body: "A roadmap your teams can actually follow.", fit: "Good fit if every team has a different list of priorities.", tools: "Planning · Prioritization" },
    ],
  },

  share: {
    title: "Know someone who needs this?",
    text: "Send this page to a colleague in one tap.",
    message: "Worth a look:",
  },
  booking: { url: "", label: "Book a 20-minute call" },
  contactForm: { enabled: true, turnstileSiteKey: "" },
  vcard: true,
  analytics: { ga4: "", cloudflareToken: "" },
  verification: { bing: "", google: "" },

  contact: {
    title: "Tell me the problem.",
    text: "A few sentences is enough. I'll reply with what it takes and a fixed price.",
    also: "Also open to the right full-time role.",
  },

  footer: { templateUrl: "" },
};
