# KisanSaarthi-Agrochain

This monorepo combines two integrated systems:
1. **KisanSaarthi**: AI voice + app system for farmer procurement slot booking, live queue status, and payment tracking.
2. **AgroChain**: A blockchain proof layer on Shardeum that anchors key procurement/payment events so they cannot be silently altered.

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)

### Installation
Install all monorepo dependencies across workspaces:
```bash
pnpm install
```

### Development
Run all workspace dev servers concurrently using Turborepo:
```bash
pnpm dev
```

## Folder Ownership & Responsibilities

| Folder | Owner / Maintainers |
| :--- | :--- |
| `backend/` | Krishna, Vansh |
| `voice-ai/` | Krishna, Aarushi, Vansh |
| `mobile-app/` | Vansh |
| `staff-dashboard/` | Navya |
| `web-dashboard/` | Navya |
| `agrochain/` | Aarush |
| `design/` | Mehar |
| `docs/` | Shared (Krishna maintains) |
| `pitch/` | Navya, Mehar |
