# Flip 7 Leaderboard

A fun, colorful leaderboard for tracking Flip 7 card game winners with celebration animations!

## Features

- Animated splash screen with 7 cards fanning out
- Real-time leaderboard with medal badges
- Add and delete players
- Record wins with a 3-phase celebration animation:
  1. Cards deal one-by-one onto the screen
  2. Cards flip to reveal their faces
  3. Winner reveal with confetti explosion
- Real-time sync across devices (when using Supabase)
- Works offline with localStorage fallback

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Set up Supabase for real-time sync

If you want real-time updates across devices:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase-setup.sql`
4. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without Supabase, the app works in demo mode using localStorage.

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Deploying

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push to GitHub
2. Import to Netlify
3. Set build command to `npm run build`
4. Set publish directory to `dist`
5. Add environment variables
6. Deploy!

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (pastel theme)
- Framer Motion (animations)
- canvas-confetti (celebration effects)
- Supabase (real-time database)
- lucide-react (icons)
