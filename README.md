# Task Dashboard

A modern, premium project & task management dashboard built with Next.js, Supabase, and shadcn/ui.

## Features

- **Premium UI:** Glassmorphism, gradients, responsive design, and beautiful animations throughout.
- **Projects & Tasks:** Create, edit, and delete projects and tasks with rich forms and validation.
- **Drag & Drop:** Move tasks between columns (To Do, In Progress, Done) with smooth drag-and-drop.
- **Filtering & Search:** Instantly filter tasks by status, search by title, and sort by creation or due date.
- **Assignee & Project Context:** See assignee names and project names on every task card.
- **Delete with Confirmation:** Delete tasks and projects with glassy confirmation dialogs.
- **Mobile Ready:** Fully responsive, with a hamburger sidebar on mobile and premium experience everywhere.
- **Email Auth Only:** Secure login/signup via email and password (no social providers).
- **Supabase Auth & RLS:** Secure, scalable backend with row-level security.
- **Testing:** Jest & Cypress for unit and e2e tests.

## Setup

1. `pnpm install` (or `npm install`)
2. Create `.env.local` with your Supabase keys:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
3. `pnpm dev` (or `npm run dev`)

## Scripts

- `pnpm dev`, `pnpm build`, `pnpm start`
- `pnpm test`, `pnpm lint`, `pnpm cypress:run`

## Deployment Notes

- **Linting:** If you encounter lint errors during deployment, you can disable lint blocking by adding to `next.config.js`:
  ```js
  module.exports = {
    eslint: { ignoreDuringBuilds: true },
  };
  ```
- **Production:** Deploy on Vercel, Netlify, or any platform supporting Next.js 15 and environment variables.

---

Enjoy your premium, modern task dashboard! 🎉
