# AGENTS.md

## Build/Lint/Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes typecheck)
- `pnpm server:dev` - Start PartyKit server
- `tsc --noEmit` - Type checking only
- No test framework configured (no tests found)

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, ES2022 target
- **Imports**: Use `@/` alias for src/ imports
- **Styling**: Tailwind CSS with `cn()` utility for merging classes
- **Components**: Use Radix UI patterns, `class-variance-authority` for variants
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Props**: Use TypeScript interfaces, prefer composition over inheritance
- **Formatting**: No explicit formatter configured (follow existing patterns)
- **Error Handling**: Use TypeScript strict null checks, explicit error types

## Git Commands
- `git worktree add ../draft-of-destiny-feature feature-branch-name` - Create worktree
- `git commit --author="Developer Bot <dev-bot@devinda.me>" -m "message"` - Commit with different author
