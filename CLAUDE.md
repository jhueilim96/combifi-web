# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run pages:build` - Build for Cloudflare Pages deployment
- `npm run preview` - Build and preview on Cloudflare Pages locally
- `npm run deploy` - Build and deploy to Cloudflare Pages

## Project Architecture

This is a Next.js 15 application for Combifi, a unified finance app focused on expense splitting functionality. The app is deployed on Cloudflare Pages with edge runtime support.

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 with custom color system using CSS variables
- **Database**: Supabase with TypeScript types
- **Validation**: Zod schemas
- **Theme**: next-themes for dark/light mode (class-based)
- **Deployment**: Cloudflare Pages with `@cloudflare/next-on-pages`

### Application Structure

**Main Features**:
- Instant expense splits accessible via `/instant-splits/[id]` routes
- Password-protected expense records with participant management
- Multiple split modes: per person, friend split, and host-managed
- Real-time payment status tracking and QR code generation

**Key Directories**:
- `src/app/instant-splits/[id]/` - Core expense splitting functionality
- `src/components/splits/` - Split-related UI components organized by feature
- `src/components/splits/modes/` - Different splitting calculation modes
- `src/components/splits/payment/` - Payment UI components
- `src/lib/` - Utilities, database types, and Supabase client configuration

### Database Integration

Uses Supabase with custom client configuration that includes:
- Password-based access control via custom headers
- Session persistence disabled for security
- Type-safe database operations with generated TypeScript types

### Styling System

Custom Tailwind configuration with:
- Primary and gray color scales using CSS variables
- Geist font family (sans and mono)
- Custom animations (fadeIn, scaleIn)
- Dark mode support with class-based theme switching

### Key Components

- **Split Modes**: `SplitFriend`, `SplitPerPax`, `SplitHost` for different calculation methods
- **Payment Components**: QR code generation, amount display, status tracking
- **UI Components**: Custom Button, OTPInput, LoadingScreen components
- **Validation**: Zod schemas for participant data and amounts

### Deployment Configuration

- Cloudflare Pages deployment with Node.js compatibility
- Wrangler configuration for local preview and deployment
- Edge runtime support for optimal performance
- Production redirects to main domain (combifi.app)

### Development Notes

- Uses absolute imports with `@/*` path mapping
- TypeScript strict mode enabled
- ESLint configured with Next.js and Prettier rules
- Development mode includes Cloudflare dev platform setup
- Home page redirects to production in non-development environments