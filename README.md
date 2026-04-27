# TutorFin

[![ci](https://github.com/westurner/tutorfin/actions/workflows/ci.yml/badge.svg)](https://github.com/westurner/tutorfin/actions/workflows/ci.yml)
<p>
  <img src="https://img.shields.io/badge/React-19.0-blue?style=flat&colorA=18181B&colorB=28CF8D" alt="React">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=flat&colorA=18181B&colorB=28CF8D" alt="Next.js">
  <img src="https://img.shields.io/badge/Three.js-0.173.0-green?style=flat&colorA=18181B&colorB=28CF8D" alt="Three.js">
  <img src="https://img.shields.io/badge/R3F-9.0.4-orange?style=flat&colorA=18181B&colorB=28CF8D" alt="React Three Fiber">
  <img src="https://img.shields.io/badge/Koota-ECS-purple?style=flat&colorA=18181B&colorB=28CF8D" alt="Koota ECS">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat&colorA=18181B&colorB=28CF8D" alt="License">
</p>

**TutorFin** is an interactive financial literacy tutor app combining the power of modern web technologies (Next.js, React) with immersive 3D experiences (React Three Fiber + Koota ECS) and ledger-processing capabilities.

## Features

- **Interactive 3D Learning**: Uses React Three Fiber and Koota ECS for highly interactive, game-like financial concepts.
- **Modern Web App**: Built on top of Next.js 15 for robust rendering and React 19.
- **LedgerText Integrations**: Comes with specialized `ledgertext-py` and `ledgertext-ts` packages for textual ledger operations.
- **High Test Coverage**: Comprehensive suite with Playwright for E2E, Vitest for TS/TSX, and Pytest for Python modules.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pnpm (recommended)

### Installation

TutorFin uses a monorepo setup via `pnpm` workspaces.

```bash
# Install dependencies across all workspaces
pnpm install
```

### Usage

```bash
# Start the main development server
pnpm run dev
```

Visit `http://localhost:5173` for the Vite interactive 3D app and Web configurations for the Next.js frontend.

## Project Structure

```
tutorfin/
├── curriculum/         # Course material and curriculum plans
│   ├── courses/        # Configured learning paths
│   │   ├── personal-finance-100/
│   │   ├── business-finance-100/
│   │   └── project-accounting-100/
│   │       ├── course.md
│   │       └── modules/
│   │           ├── 01-project-budgeting.md
│   │           ├── 02-direct-vs-indirect-costs.md
│   │           ├── 03-tracking-and-ledger-basics.md
│   │           └── 04-project-profitability.md
│   └── indexes/        # Standard alignments and structure mapping
│       ├── common-core.md
│       ├── khan-academy.md
│       └── topics.md
├── src/                # R3F + Koota ECS 3D game logic and components
│   ├── components/     # React components
│   │   ├── canvas/     # 3D scene components
│   │   └── dom/        # UI components
│   │    
│   ├── hooks/          # Custom React hooks
│   ├── store/          # State management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
├── web/                # tutorfin Next.js web application
│   ├── app/            # App router pages and layouts
│   ├── components/     # UI components
│   ├── lib/            # Utility and server functions
│   ├── tests/          # E2E and component tests specific to the web app
│   ├── next.config.mjs # Next.js configuration
│   ├── package.json    # Web dependencies
│   └── wrangler.toml   # Cloudflare deployment config
├── packages/           # Shared libraries
│   ├── ledgertext-py/  # Python LedgerText library for notebooks
│   └── ledgertext-ts/  # TypeScript LedgerText library for web
├── tests/              # E2E and component testing logic
├── docs/               # Technical documentation
├── public/             # Static assets
├── .gitignore          # Git ignore file
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```


## Documentation
- https://github.com/westurner/tutorfin

## Resources

- [Drei Documentation](https://github.com/pmndrs/drei)
- [React Documentation](https://react.dev/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [viber3d Documentation](https://viber3d.instructa.ai/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
