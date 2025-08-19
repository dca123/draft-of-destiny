# Draft of Destiny

A collaborative Dota 2 draft analysis tool built with React, TypeScript, and PartyKit for real-time synchronization.

## Features

- **Real-time Drafting**: Multiple users can join the same draft and make selections simultaneously
- **Hero Database**: Complete Dota 2 hero roster with attributes and metadata
- **Draft Analysis**: Track bans and picks through the complete draft phase
- **State Management**: Robust state machine for handling complex draft logic
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Automatic theme switching based on system preferences

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router
- **State Management**: XState (state machines), Jotai (atomic state), Zustand (lobby state)
- **Database**: SQLite with Drizzle ORM
- **Real-time**: PartyKit for WebSocket connections
- **Styling**: Tailwind CSS with Radix UI components
- **Build**: Vite with SSR support

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev

# Start PartyKit server for real-time features
pnpm run server:dev
```

### Environment Variables

Create a `.env` file with:

```bash
# Database
DATABASE_URL=file:local.db

# PartyKit
PARTYKIT_HOST=localhost:1999
```

## Development

### Available Scripts

- `pnpm run dev` - Start Vite dev server
- `pnpm run server:dev` - Start PartyKit server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

### Database Management

```bash
# Generate migrations
pnpm run db:generate

# Push schema changes
pnpm run db:push

# Open Drizzle Studio
pnpm run db:studio
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Draft.tsx       # Main draft interface
│   ├── HeroGrid.tsx    # Hero selection grid
│   └── TeamSelect.tsx  # Team configuration
├── db/                 # Database layer
│   ├── schema/         # Drizzle schema definitions
│   └── dota-db-schema/ # Game data (heroes, items)
├── routes/             # TanStack Router routes
├── lib/                # Utilities and helpers
└── styles/             # Global styles
```

## How It Works

1. **Draft Creation**: Users create a new draft or join an existing one via draft ID
2. **Team Setup**: Configure teams (Radiant/Dire) and player positions
3. **Hero Selection**: Take turns banning and picking heroes
4. **Real-time Sync**: All participants see updates instantly via PartyKit
5. **State Persistence**: Draft state is saved to SQLite database

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Self-hosted

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Acknowledgments

- Dota 2 hero data provided by [OpenDota API](https://docs.opendota.com/)
- Built with modern web technologies and open-source libraries