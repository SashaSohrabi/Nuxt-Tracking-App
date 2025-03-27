# Nuxt Tracking 🧭

A minimal Nuxt 3 app with Supabase authentication, form validation via Zod, seeded fake data, and a clean interface powered by @nuxt/ui.

🌐 **Live Demo**

[Click here to view the deployed app](https://nuxt-tracking.vercel.app/login)

📁 **Project Structure**

- `app/` – Nuxt 3 application folder (pages, components, layouts)
- `seed.ts` – Script to populate Supabase with fake users using Faker
- `utils/` – Shared helper functions and validation logic


✨ **Features**

- 🔒 Supabase Auth Integration  
- ⚡️ Built with Nuxt 3  
- 🎨 @nuxt/ui for modern styling  
- 🧰 Zod for schema validation  
- 📅 date-fns for date utilities  
- 🌱 Seed script using Faker for testing data  
- 🧑‍💻 TypeScript support

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```