# QRDemo_cgreen (UPS shipment demo)

Interactive **UPS-style routing** demo: a legacy “desktop shipping” layout vs a **modern** flow, with **LaunchDarkly** feature flags and a **user + hub/region** context for targeting. Built with **React** and **Vite**, static-host friendly for **GitHub Pages** (phone-friendly).

## Project structure

| Path | Purpose |
|------|---------|
| `index.html` | Vite entry HTML |
| `vite.config.js` | Build config; `base` is set for GitHub Pages via `VITE_BASE` (see below) |
| `src/main.jsx` | App bootstrap |
| `src/App.jsx` | `FeatureFlagsProvider` shell; switches legacy vs modern by flag |
| `src/index.css` / `src/app.css` | Global and app-level styles |
| `src/context/FeatureFlagsProvider.jsx` | React integration: connect LD, `change` → refresh flags, `setDemoContext` for identify |
| `src/lib/launchdarkly/FeatureFlagService.js` | Class wrapping the LD client: `connect`, `identify`, `getFlagsSnapshot`, `hubId` / `region` on context |
| `src/lib/launchdarkly/demoContextTypes.js` | JSDoc typedefs for the demo context |
| `src/components/legacy/` | NRGship-style form (`LegacyShipmentView`, `legacy-shipment.css`) |
| `src/components/modern/` | Modern cards + route strip (`ModernShipmentView`, `modern-shipment.css`) |
| `src/components/shared/` | Shared pieces (e.g. `RatePricingBlock`) |
| `.env` | Local only (gitignored). Copy from `.env.example` |

**LaunchDarkly flags (boolean) used in the app**

- `release-modern-shipment-ui` — on: modern UI; off: legacy UI  
- `show-shipment-pricing-insights` — on: pricing/status insights; off: that surface is hidden and the rate area is simpler  

## Prerequisites

- **Node.js 18+** (recommended; Vite 5 works well on current LTS)  
- **npm** (ships with Node)

## Run locally

1. **Clone and install**

   ```bash
   git clone <your-fork-or-repo-url>
   cd QRDemo_cgreen
   npm install
   ```

2. **LaunchDarkly (optional for local UI)**

   - Create `.env` in the project root (same folder as `package.json`):

     ```bash
     cp .env.example .env
     ```

   - Set your **client-side (browser) SDK ID**:

     ```env
     VITE_LAUNCHDARKLY_CLIENT_ID=your-client-side-id
     ```

   - In LaunchDarkly, add the two flags above. If the ID is missing, the app still runs and uses **built-in defaults** (legacy + pricing insights on); a small notice is shown at the bottom.

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open the URL Vite prints (usually `http://localhost:5173`).

4. **Production build (optional check)**

   ```bash
   npm run build
   npx vite preview
   ```

## Host on GitHub Pages

Vite must know the **public path** your site is served from. For a **project site** the URL is:

`https://<user-or-org>.github.io/<repo-name>/`

so the asset `base` must be `/<repo-name>/` (leading and trailing slash matters; trailing slash is typical for a directory site).

1. **Set the repo name in the build** (replace if your repository name is different):

   ```bash
   VITE_BASE=/QRDemo_cgreen/ npm run build
   ```

2. **Deploy the `dist` folder** to the `gh-pages` branch. The fastest path without extra repo files is `gh-pages` via npx:

   ```bash
   npx gh-pages -d dist
   ```

   First run may ask to install the package; that is expected.

3. **Enable Pages in the repo**  
   On GitHub: **Settings → Pages**  
   - **Source:** Deploy from a branch  
   - **Branch:** `gh-pages`, folder **/ (root)**  
   - Save. After a minute, the site is available at your project URL, for example `https://<user>.github.io/QRDemo_cgreen/`.

4. **LaunchDarkly on the hosted site**

   - Use the same **client-side** environment ID; it is safe to be public in a browser app, but follow your org’s key hygiene.  
   - Either bake it in at build time (see below) or set `VITE_LAUNCHDARKLY_CLIENT_ID` in **GitHub Actions** secrets and pass it into the build step (recommended for rotation without committing secrets, though the client key is not a server secret).  
   - For a static build, the common pattern is: `VITE_LAUNCHDARKLY_CLIENT_ID=... VITE_BASE=/QRDemo_cgreen/ npm run build` then deploy `dist`.  
   - Ensure flag targeting matches your `identify` context (e.g. `hubId`, `region`).

**If your site is a user/organization page** (`<user>.github.io` with the repo named `<user>.github.io`), the `base` is usually `/` — use:

```bash
npm run build
npx gh-pages -d dist
```

**CORS / LD:** the LaunchDarkly client-side SDK calls LaunchDarkly from the browser; no extra CORS setup is required for the hosted GitHub domain beyond normal SDK usage.

---

*Fork conceptually aligned with the [react_qr_app](https://github.com/cgreenld/react_qr_app) style demo, adapted for this UPS routing and LD context story.*
