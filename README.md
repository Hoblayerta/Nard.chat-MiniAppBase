# Nard Chat - Farcaster MiniApp

Nard Chat is a decentralized social platform built as a Farcaster MiniApp that allows users to create posts, upload content to the blockchain, and interact with smart contracts on Base network.

## 🚀 Features

- **Farcaster Integration**: Native MiniApp with Frame SDK support
- **Blockchain Posts**: Upload posts directly to smart contracts on Base
- **Wallet Authentication**: Connect and authenticate with Web3 wallets
- **Decentralized Storage**: Content stored on-chain 
- **Real-time Notifications**: Background notifications via Redis
- **Responsive Design**: Mobile-first design optimized for Farcaster

## 🏗️ Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Blockchain**: Base Sepolia, wagmi, viem
- **MiniKit**: @farcaster/frame-sdk for Farcaster integration
- **OnchainKit**: @coinbase/onchainkit for blockchain UI components
- **Storage**: Redis (Upstash) for notifications
- **Authentication**: Web3 wallet integration

## 📝 Smart Contract Information

### Contract Address (Base Sepolia)
```
0xc613D6564Baeac4Abf110eCAd84AC59016233c6e
```

### Example Post Upload Transaction
View an example of a post uploaded to the smart contract:
[Transaction on Base Sepolia Blockscout](https://base-sepolia.blockscout.com/tx/0x2303d21f44b39049c079e1779910e4b95784d8d3b397f5dd37e2e4878ed78c1a)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Web3 wallet (MetaMask, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/nard-chat
cd nard-chat/nard-miniapp/nard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_URL=http://localhost:3000

# Farcaster Frame metadata
FARCASTER_HEADER=your_farcaster_header
FARCASTER_PAYLOAD=your_farcaster_payload
FARCASTER_SIGNATURE=your_farcaster_signature

# Redis for notifications
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" to authenticate with your Web3 wallet
2. **Create Posts**: Use the post creation interface to write content
3. **Upload to Blockchain**: If you are admin of your community Click "Upload to Blockchain" to store your post on Base
4. **View Transactions**: Check your transactions on [Base Sepolia Blockscout](https://base-sepolia.blockscout.com/)

## 🏗️ Architecture

### Key Components
- **MiniKitProvider**: Wraps app with Farcaster Frame SDK
- **Wallet Authentication**: Web3 wallet connection and management
- **Blockchain Upload**: Smart contract integration for post storage
- **Notification System**: Redis-backed background notifications
- **Frame Integration**: Native Farcaster Frame functionality

### File Structure
```
nard/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── providers.tsx       # MiniKit and Web3 providers
│   └── layout.tsx         # App layout with Frame metadata
├── lib/                   # Utility functions
│   ├── notification-client.ts
│   └── notification.ts
└── public/                # Static assets
```

2. Verify environment variables, these will be set up by the `npx create-onchain --mini` command:

You can regenerate the FARCASTER Account Association environment variables by running `npx create-onchain --manifest` in your project directory.

The environment variables enable the following features:

- Frame metadata - Sets up the Frame Embed that will be shown when you cast your frame
- Account association - Allows users to add your frame to their account, enables notifications
- Redis API keys - Enable Webhooks and background notifications for your application by storing users notification details

```bash
# Shared/OnchainKit variables
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Frame metadata
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=
NEXT_PUBLIC_APP_SUBTITLE=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_SPLASH_IMAGE=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=
NEXT_PUBLIC_APP_HERO_IMAGE=
NEXT_PUBLIC_APP_TAGLINE=
NEXT_PUBLIC_APP_OG_TITLE=
NEXT_PUBLIC_APP_OG_DESCRIPTION=
NEXT_PUBLIC_APP_OG_IMAGE=

# Redis config
REDIS_URL=
REDIS_TOKEN=
```

3. Start the development server:
```bash
npm run dev
```

## Template Features

### Frame Configuration
- `.well-known/farcaster.json` endpoint configured for Frame metadata and account association
- Frame metadata automatically added to page headers in `layout.tsx`

### Background Notifications
- Redis-backed notification system using Upstash
- Ready-to-use notification endpoints in `api/notify` and `api/webhook`
- Notification client utilities in `lib/notification-client.ts`

### Theming
- Custom theme defined in `theme.css` with OnchainKit variables
- Pixel font integration with Pixelify Sans
- Dark/light mode support through OnchainKit

### MiniKit Provider
The app is wrapped with `MiniKitProvider` in `providers.tsx`, configured with:
- OnchainKit integration
- Access to Frames context
- Sets up Wagmi Connectors
- Sets up Frame SDK listeners
- Applies Safe Area Insets

## Customization

To get started building your own frame, follow these steps:

1. Remove the DemoComponents:
   - Delete `components/DemoComponents.tsx`
   - Remove demo-related imports from `page.tsx`

2. Start building your Frame:
   - Modify `page.tsx` to create your Frame UI
   - Update theme variables in `theme.css`
   - Adjust MiniKit configuration in `providers.tsx`

3. Add your frame to your account:
   - Cast your frame to see it in action
   - Share your frame with others to start building your community

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
