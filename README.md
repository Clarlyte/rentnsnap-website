# RentNSnap - Camera Rental Management System

A modern, full-featured camera rental management system built with Next.js 14, designed specifically for camera rental businesses in the Philippines. Streamline your rental operations with an intuitive dashboard, smart scheduling, and comprehensive customer management.

## Core Features

### Equipment Management
- Detailed equipment inventory tracking
- Multiple equipment categories support
- Maintenance scheduling and status tracking
- Customizable rental rates based on duration
- Real-time availability tracking
- Equipment usage history

### Smart Rental System
- Automated availability checking
- Double-booking prevention
- Flexible scheduling with modification support
- Status tracking (Reserved, Active, Completed, Cancelled)
- Digital contract generation
- Automated status updates based on dates

### Customer Management
- Secure customer profiles
- ID verification system
- Digital signature capture
- Customer history tracking
- Profile image management
- Automated verification process

### Business Operations
- Comprehensive dashboard analytics
- Revenue tracking and reporting
- Equipment utilization metrics
- Upcoming returns monitoring
- Maintenance scheduling
- Multi-tier pricing support

### Security & Authentication
- Secure user authentication via Supabase
- Role-based access control
- Protected dashboard routes
- Secure API endpoints
- Environment variable protection

## Technical Stack

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with custom animations
- Shadcn UI components
- React Hook Form for form handling
- Date-fns for date manipulation
- Lucide React for icons
- Sonner for toast notifications

### Backend & Database
- Supabase for authentication and database
- Next.js API routes
- PostgreSQL database
- Real-time updates support
- Secure file storage

### Development Tools
- ESLint and TypeScript for code quality
- Prettier for code formatting
- PostCSS for CSS processing
- Environment variable management
- Vercel deployment support

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
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

3. Configure environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Required environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```plaintext
rentnsnap/
├── app/                  # App Router pages and layouts
│   ├── api/             # API routes
│   ├── (auth)/          # Authentication pages
│   ├── dashboard/       # Protected dashboard routes
│   ├── globals.css      # Global CSS
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── error.tsx        # Error handling
│   └── not-found.tsx    # 404 page
├── components/          # Reusable components
│   ├── ui/             # UI components (from shadcn/ui)
│   └── ...             # Custom components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── public/             # Static assets
├── supabase/           # Supabase configurations
├── migrations/         # Database migrations
├── .next/              # Next.js build output
├── node_modules/       # Dependencies
├── .env               # Environment variables
├── .env.example       # Example environment variables
├── next.config.mjs    # Next.js configuration
├── package.json       # Project dependencies and scripts
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── middleware.ts      # Next.js middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Frentnsnap)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
