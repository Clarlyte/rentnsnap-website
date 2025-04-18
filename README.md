# RentNSnap - Camera Rental Management System

A comprehensive camera rental management system built with Next.js, designed specifically for camera rental businesses in the Philippines. Streamline your rental operations with an intuitive dashboard, reservation management, and customer verification.

## Features

- **Modern Tech Stack**
  - Next.js 14+ with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn UI components for beautiful interfaces
  - Supabase for authentication and database

- **Core Functionality**
  - Camera rental management
  - Reservation system
  - Customer verification
  - Contract generation
  - Dashboard analytics
  - User authentication and authorization

- **UI/UX Features**
  - Responsive design
  - Dark mode support
  - Modern and intuitive interface
  - Form validation with react-hook-form
  - Toast notifications
  - Loading states and error handling

- **Development Tools**
  - ESLint and Prettier for code quality
  - TypeScript for type safety
  - PostCSS for CSS processing
  - Comprehensive component library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Git

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/rentnsnap.git
cd rentnsnap
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

Copy the `.env.example` file to `.env` and fill in your Supabase credentials:

\`\`\`bash
cp .env.example .env
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
rentnsnap/
├── app/                  # App Router pages and layouts
│   ├── api/             # API routes
│   ├── (auth)/          # Authentication pages
│   ├── dashboard/       # Protected dashboard routes
│   ├── globals.css      # Global CSS
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
│   ├── ui/             # UI components (from shadcn/ui)
│   └── ...             # Custom components
├── lib/                # Utility functions and configurations
│   ├── supabase/      # Supabase client
│   └── utils.ts       # Utility functions
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── public/            # Static assets
└── ...               # Configuration files
\`\`\`

## Key Components

- **Authentication System**: Secure user authentication with Supabase
- **Dashboard**: Comprehensive rental management interface
- **Reservation System**: Calendar-based booking system
- **Customer Management**: Customer verification and profile management
- **Contract Generation**: Automated contract creation
- **Analytics**: Business insights and reporting

## Adding New UI Components

This project uses Shadcn UI. Add new components as needed:

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

## Deployment

The application can be deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Frentnsnap)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
