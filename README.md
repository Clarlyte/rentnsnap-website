# Next.js Boilerplate

A feature-rich boilerplate for Next.js projects with App Router, TypeScript, Tailwind CSS, Shadcn UI, and Supabase authentication.

## Features

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn UI** for beautiful UI components
- **Supabase** for authentication and database
- **ESLint** and **Prettier** for code quality
- **Dark mode** support with theme toggle
- **Responsive design** out of the box

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account

### Installation

1. Clone this repository:

\`\`\`bash
git clone https://github.com/yourusername/nextjs-boilerplate.git
cd nextjs-boilerplate
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
nextjs-boilerplate/
├── app/                  # App Router pages and layouts
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Protected dashboard routes
│   ├── globals.css       # Global CSS
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── ui/               # UI components (from shadcn/ui)
│   └── ...
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client
│   └── utils.ts          # Utility functions
├── providers/            # Context providers
│   ├── auth-provider.tsx # Authentication provider
│   └── theme-provider.tsx # Theme provider
├── types/                # TypeScript type definitions
│   └── supabase.ts       # Supabase database types
└── ...                   # Config files
\`\`\`

## Adding New UI Components

This project uses Shadcn UI, which allows you to add new components as needed:

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
\`\`\`

## Deployment

This project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fnextjs-boilerplate)

## License

MIT
