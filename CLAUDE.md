# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Workflow
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version of the application
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint to check code quality and style

### Package Management
- Use `npm install` (package-lock.json present, avoid yarn/pnpm to prevent lock file conflicts)

## Project Architecture

### MiniKit Farcaster Mini App
This is a Next.js 15 application built specifically as a Farcaster MiniApp using:
- **MiniKit SDK** (@farcaster/frame-sdk) for Farcaster integration
- **OnchainKit** (@coinbase/onchainkit) for blockchain functionality and UI components  
- **Base network** integration via wagmi and viem
- **Redis** for notification storage via Upstash

### Key Architectural Patterns

#### Provider Architecture
- `app/providers.tsx` - MiniKitProvider wraps entire app with OnchainKit integration
- Configured for Base network with auto theme and safe area insets
- Enables Frame SDK listeners and Wagmi connectors

#### Frame Integration
- `.well-known/farcaster.json` endpoint for Frame metadata and account association
- Frame metadata automatically injected via `layout.tsx` generateMetadata()
- Environment variables control Frame appearance and behavior

#### Notification System
- Background notifications via Redis (Upstash)
- `lib/notification-client.ts` - Handles sending Frame notifications
- `lib/notification.ts` - User notification details management
- API routes: `api/notify` and `api/webhook` for notification endpoints

#### Component Structure
- `app/components/DemoComponents.tsx` - Reusable UI components (Button, Card, Icon, etc.)
- Custom theme system using CSS variables in `theme.css`
- OnchainKit Transaction components for blockchain interactions

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom CSS variables theme
- **Blockchain**: wagmi + viem for Web3 integration
- **State**: React Query (@tanstack/react-query) for async state
- **Database**: Redis for notification persistence
- **Type Safety**: TypeScript with strict mode enabled

### File Structure Conventions
- `app/` - Next.js app directory with routes and components
- `lib/` - Utility functions and business logic  
- `public/` - Static assets (icons, images)
- Theme customization via CSS variables in `app/theme.css`

### Environment Configuration
Critical environment variables (see .env):
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - OnchainKit integration
- `NEXT_PUBLIC_URL` - App URL for Frame metadata
- Farcaster Frame metadata variables (FARCASTER_HEADER, etc.)
- Redis connection for notifications (REDIS_URL, REDIS_TOKEN)

### Development Notes
- Uses Next.js webpack externals configuration to silence WalletConnect warnings
- MiniKit integration requires specific Frame metadata structure
- Transaction components require wallet connection for functionality
- Notification system requires Redis configuration for background processing