# SecretSips - Social Recipe Sharing for Starbucks Enthusiasts

![Secret Sips Screenshot](https://github.com/user-attachments/assets/fd3237c5-f602-43ee-888f-f14e48e9ee1b)

SecretSips is a decentralized social platform built on Aptos blockchain where Starbucks enthusiasts can share and discover custom drink recipes, get rewarded for their creativity, and build a community around their favorite coffee customizations.

## Table of Contents

- [Demo Video](#demo-video)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tokenomics](#tokenomics)
- [Tech Stack](#tech-stack)
- [Development Commands](#development-commands)
- [Deployment](#deployment)
- [Aptos Wallet Setup](#aptos-wallet-setup)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Demo Video

<!-- will be added soon -->
<video width="640" height="360" controls>
  <source src="secret_sips.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Features

- **Share Custom Recipes**: Create and share your unique Starbucks drink recipes with the community
- **Earn Rewards**: Get rewarded in APT tokens when others like your recipes
- **Leaderboard System**: Top recipes rise to the leaderboard, creating healthy competition
- **Decentralized Ownership**: All content is stored on the Aptos blockchain, ensuring censorship resistance
- **Mobile Responsive Design**: Optimized user experience across all devices
- **Web3 Wallet Integration**: Connect with popular Aptos-compatible wallets

## How It Works

1. **Connect Your Wallet**: Use any Aptos-compatible wallet to sign in
2. **Browse Recipes**: Discover creative drink recipes shared by the community
3. **Share Your Own**: Create and publish your custom Starbucks recipe
4. **Upvote and Reward**: When you like a recipe, upvote it and the creator receives APT tokens
5. **Track Performance**: See how your recipes rank on the leaderboard
6. **Redeem Rewards**: Cash out your earned tokens whenever you want

## Tokenomics

- Each upvote sends 0.01 APT (~$0.05) directly to the recipe creator
- Creators can track their earnings in real-time
- Build a passive income stream from your most popular recipes
- Completely transparent reward system powered by Aptos blockchain

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Blockchain**: Aptos Network
- **Smart Contracts**: Move programming language
- **Authentication**: Aptos Wallet Adapter
- **Development Tools**: TypeScript, Node.js
- **PWA Support**: Works offline and can be installed on mobile devices

## Development Commands

```bash
# Run local development server
pnpm run dev

# Compile the Move contract
pnpm run move:compile

# Test the Move contract
pnpm run move:test

# Deploy the Move contract
pnpm run move:publish

# Upgrade the Move contract
pnpm run move:upgrade

# Deploy frontend to Vercel
pnpm run deploy
```

## Future Roadmap

- **Social Features**: Follow creators, comment on recipes
- **NFT Recipe Cards**: Limited edition recipe collections
- **Mobile App**: Native mobile applications
- **Partner Integrations**: Official Starbucks partnerships
- **Community Governance**: DAO for platform decisions

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Aptos CLI](https://aptos.dev/en/build/cli) (for contract deployment)
- [Git](https://git-scm.com/)

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/EverythingSuckz/secret-sips
cd secret-sips

# Install dependencies
pnpm i

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Local Development

```bash
# Start the development server
pnpm run dev

# The site will be available at http://localhost:3000
```

### Contract Deployment

```bash
# Compile the Move contract
pnpm run move:compile

# Test the contract
pnpm run move:test

# Deploy to Aptos blockchain (requires proper Aptos configuration)
pnpm run move:publish
```

## Aptos Wallet Setup

To enable wallet integration and contract interactions, you'll need to configure the following environment variables:

```env
# .env example

PROJECT_NAME=secret-sips
NEXT_PUBLIC_APP_NETWORK=testnet
NEXT_PUBLIC_APTOS_API_KEY=
NEXT_MODULE_PUBLISHER_ACCOUNT_ADDRESS=
NEXT_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY=
NEXT_PUBLIC_MODULE_ADDRESS=
FREEIMAGE_API_KEY=
```

For contract deployment, you'll need:
1. An Aptos wallet with sufficient funds - create using the [Aptos CLI](#prerequisites)
2. Generate an API key from [Aptos API Portal](https://build.aptoslabs.com/manage)
3. Set `NEXT_MODULE_PUBLISHER_ACCOUNT_ADDRESS` and `NEXT_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY` with your wallet credentials
4. After deployment, set `NEXT_PUBLIC_MODULE_ADDRESS` to your published module address

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

### Core Team
- [Sumit](https://github.com/sumitk-mridha)
- [Harsheta](https://github.com/HARSHEE04)
- [Wen](https://github.com/Wen2025)
- [Maram](https://github.com/MJawass)

### Outside Collaborators
- [AlekenD](https://github.com/AlkenD)

---

Built with appreciation using the [Aptos Network](https://aptoslabs.com/)
