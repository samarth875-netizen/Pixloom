# Pixloom — Browser-Based Image Editor

Pixloom is a fast, AI-powered image editor that runs entirely in your browser. It bridges the gap between complex desktop software (like Photoshop) and limited template apps by delivering professional-grade editing capabilities—including multi-layer management, masks, curves, non-destructive adjustments, and AI features like instant background removal and upscaling—with zero installation required.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom locked dark palette with `#F5F547` accent)
- **Icons**: [lucide-react](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Canvas Engine**: [Fabric.js](http://fabricjs.com/) (Phase 1)
- **Pixel Processing**: [wasm-vips](https://github.com/kleisauke/wasm-vips) (Phase 1)
- **Database & Storage**: [Supabase](https://supabase.com/)
- **AI Pipelines**: [Replicate API](https://replicate.com/) (Background removal, upscaling)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🎨 Design System & Color Palette

- **Primary Background**: `#0A0A0A` (Black for dark sections, `#F5F547` for Hero section)
- **Card Background**: `#171717` (Dark Gray) with `rounded-3xl` (~24px radius)
- **Accent Color**: `#F5F547` (Bright Yellow-Green) for CTAs, highlighted cards, toggles, badges, and progress meters
- **Text**: `#FFFFFF` (Headings), `#9CA3AF` (Body text)
- **Buttons**: Pill-shaped (`rounded-full`), available in `black`, `yellow`, and `outline` variants

---

## 📁 Folder Structure

```
Pixloom/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx                # Root layout with fonts & dark theme
│       │   ├── page.tsx                  # Marketing landing page
│       │   ├── editor/page.tsx           # Web editor workspace
│       │   ├── dashboard/page.tsx        # User dashboard (projects, create)
│       │   ├── login/ & signup/          # Supabase auth pages
│       │   ├── about/ contact/ pricing/  # Marketing pages
│       │   ├── privacy/ terms/           # Legal pages
│       │   ├── auth/callback/            # OAuth callback route handler
│       │   └── globals.css               # Design tokens & Tailwind setup
│       ├── components/
│       │   ├── landing/                  # Landing page sections
│       │   │   ├── Navbar.tsx            # Sticky header with brand & CTA
│       │   │   ├── Hero.tsx              # Yellow hero & interactive mockup
│       │   │   ├── LogoStrip.tsx         # Trust logo strip
│       │   │   ├── FeatureGrid.tsx       # 2x2 feature grid with highlighted card
│       │   │   ├── CTASection.tsx        # Bottom call-to-action banner
│       │   │   └── Footer.tsx            # Multi-column footer
│       │   ├── ui/                       # Reusable UI components (Button, etc.)
│       │   ├── auth/                     # AuthForm, useUser, SignOutButton
│       │   ├── site/                     # Shared SiteHeader for sub-pages
│       │   ├── canvas/                   # Fabric.js canvas components
│       │   ├── toolbar/                  # Editor drawing & selection tools
│       │   └── panels/                   # Adjustments & filter panels
│       ├── lib/                          # Canvas engine, image processing, Supabase, AI
│       ├── store/                        # Zustand stores (canvas, project, history)
│       └── types/                        # TypeScript definitions
├── package.json
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/samarth875-netizen/Pixloom.git
cd Pixloom
npm install --prefix apps/web
```

### 2. Environment Variables
Create `.env.local` inside `apps/web/` (see `.env.local.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REPLICATE_API_TOKEN=your-replicate-api-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Authentication**: The app uses Supabase for email/password sign-in.
> Create a project at [supabase.com](https://supabase.com), grab the URL + anon key,
> and add the callback URL `http://localhost:3000/auth/callback`.
> If the env vars are missing, the app still runs but `/editor` and `/dashboard`
> won't require login, and auth pages will show a setup notice.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification
```bash
# Build & TypeScript type-check
npm run build --prefix apps/web
```

---

## 🚢 Deployment (Vercel)

1. Connect the GitHub repository to Vercel.
2. Set Root Directory to `apps/web`.
3. Add production environment variables in the Vercel Project Settings.
4. Deploy to preview or main branch.
