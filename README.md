# Regex Example (Next.js + PNPM + GitHub Pages)

A simple Next.js project demonstrating regular expression examples, built with **PNPM** and deployed to **GitHub Pages** as a fully static site.


## Check it out at

https://regex.zeqtech.io/


---

## 🚀 Features

- Next.js static export (`next export`)
- Fast dependency management with **pnpm**
- Automatic GitHub Pages deployment using **GitHub Actions**
- Easy local preview (`pnpm run preview`)

---

## 🛠️ Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run locally

```pnpm
pnpm dev
```

The app will be available at [http://localhost:3000]()

---

## 🏗️ Build & Test Static Export

To build and serve the static version locally:

```pnpm
pnpm run preview
```

Then open [http://localhost:8080]()

---

## ⚙️ Deployment

This project automatically deploys to **GitHub Pages** using a workflow defined in

`.github/workflows/deploy.yml`.

On every push to the `main` branch:

1. The site is built with `pnpm run build`
2. The static output (`out/`) is deployed to the `gh-pages` branch

---

## 📂 Folder Structure

```
regex-example/
├── .github/workflows/deploy.yml  # GitHub Actions deployment
├── out/                          # Static export (generated)</span><span>
├── pages/                        # Next.js pages
├── public/                       # Static assets
├── next.config.js                # Next.js config (output: "export")
├── package.json
└── pnpm
```

---

## 🧩 Useful Commands

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`     | Run Next.js in development mode   |
| `pnpm build`   | Build and export static site      |
| `pnpm preview` | Build & serve static site locally |
| `pnpm install` | Install dependencies              |

---

## About

Created by **ZeqTech** as a practical example for regex demonstrations and static Next.js deployment workflows.
