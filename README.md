🌾 KisanSetu — AI-Powered Digital Procurement Assistant for Farmers

<p align="center">
  <strong>Voice-first farmer assistance • Digital procurement workflows • Live queue visibility • Payment tracking • Verifiable procurement proofs</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-problem">Problem</a> •
  <a href="#-solution">Solution</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-development">Development</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white" alt="pnpm">
  <img src="https://img.shields.io/badge/Fastify-backend-000000?logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Realtime-3FCF8E?logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/pgvector-vector%20search-336791?logo=postgresql&logoColor=white" alt="pgvector">
  <img src="https://img.shields.io/badge/Expo-React%20Native-000020?logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000000?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-UI-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Solidity-Smart%20Contracts-363636?logo=solidity&logoColor=white" alt="Solidity">
  <img src="https://img.shields.io/badge/Hardhat-EVM%20tooling-FFF100?logo=hardhat&logoColor=black" alt="Hardhat">
</p>

📌 What is KisanSetu?

KisanSetu is a voice-first digital procurement assistant designed to make agricultural procurement easier and more transparent for farmers.

A farmer should not need to navigate complicated applications, repeatedly visit a procurement center, or depend on someone else just to answer basic questions such as:

When is my procurement slot?

What is my position in the queue?

When should I arrive?

What is the latest available mandi price?

What is the status of my procurement?

Has my payment been processed?

KisanSetu brings these interactions into one connected system.

The farmer can interact through a voice interface or mobile application, while procurement staff get a dedicated dashboard. Important procurement and payment events can additionally be anchored through AgroChain on a Shardeum EVM testnet to provide a tamper-evident proof trail.

In one line:
KisanSetu connects farmers, procurement centers, real-time operational data, AI assistance, and verifiable event proofs in one platform.

🎯 The Problem

Agricultural procurement involves multiple actors and multiple stages:

Farmer
  ↓
Registration
  ↓
Procurement Slot
  ↓
Arrival
  ↓
Queue
  ↓
Procurement
  ↓
Payment

In a fragmented workflow, farmers may have limited visibility into what is happening after registration.

Common friction points

Problem

Impact

Farmers do not know their slot

Unnecessary visits and waiting

Queue visibility is poor

Congestion and uncertainty

Information is scattered

Farmers depend on staff or repeated calls

Smartphone-first systems exclude some users

Lower accessibility

Payment status is unclear

Anxiety and repeated follow-ups

Operational staff lack one unified view

Difficult coordination

Important events can be difficult to independently verify

Lower transparency

KisanSetu addresses these problems by creating a single connected operational flow.

💡 The Solution

KisanSetu has four major layers:

1. 📞 Farmer Interaction

A farmer can interact with KisanSetu through voice.

Example:

Farmer: "Mera slot kab hai?"

The system identifies the intent, retrieves the relevant information, and responds.

2. 🧠 AI + Knowledge Layer

The AI understands the farmer's request and determines what information is required.

For knowledge retrieval, the project uses:

Supabase PostgreSQL + pgvector

instead of a separate vector database.

This lets the system keep transactional data and future semantic knowledge retrieval within the same PostgreSQL platform.

3. 🖥️ Operational Layer

Staff can use dashboards to monitor:

Today's farmers

Arrivals

Queue

Procurement

Payment processing

Payment completion

Operational status

4. ⛓️ Proof Layer

When important events occur, such as:

PROCUREMENT_COMPLETED

PAYMENT_CONFIRMED

the future AgroChain service can create a canonical event payload, hash it, and anchor the proof on a Shardeum EVM testnet.

The blockchain is not intended to store the entire farmer database.

It acts as a proof/anchor layer.

🔄 End-to-End User Journey

flowchart TD
    A["👨‍🌾 Farmer"] --> B{"Choose interaction"}
    B -->|"📞 Voice"| C["KisanSetu Voice AI"]
    B -->|"📱 App"| D["KisanSetu Mobile App"]

    C --> E["Intent Recognition"]
    D --> F["Backend API"]

    E --> F["Backend API"]

    F --> G["Supabase PostgreSQL"]

    G --> H["Farmer / Slot / Queue / Procurement / Payment Data"]

    F --> I["External Mandi Price Data"]

    F --> J["Future AI Knowledge Retrieval"]
    J --> K["pgvector"]

    F --> L["Staff Dashboard"]

    G --> M{"Important event?"}

    M -->|"PROCUREMENT_COMPLETED"| N["AgroChain Proof Builder"]
    M -->|"PAYMENT_CONFIRMED"| N

    N --> O["Canonical Payload"]
    O --> P["Event Hash"]
    P --> Q["Shardeum EVM Testnet"]

    C --> R["🔊 Voice Response"]
    L --> S["📊 Staff Visibility"]

🏗️ System Architecture

flowchart LR
    subgraph USERS["Users"]
        Farmer["👨‍🌾 Farmer"]
        Staff["👨‍💼 Procurement Staff"]
    end

    subgraph CLIENTS["Client Layer"]
        Voice["📞 Voice AI"]
        Mobile["📱 Expo Mobile App"]
        StaffUI["🖥️ Staff Dashboard"]
        Web["🌐 Farmer Web Fallback"]
    end

    subgraph CORE["KisanSetu Core"]
        Backend["⚙️ Fastify + TypeScript"]
        Auth["🔐 Supabase Auth"]
        Realtime["⚡ Supabase Realtime"]
    end

    subgraph DATA["Supabase PostgreSQL"]
        Relational["🗄️ Transactional Tables"]
        Vector["🧠 pgvector Knowledge Layer"]
    end

    subgraph EXTERNAL["External Services"]
        Mandi["🌾 Mandi / Data APIs"]
        Telephony["☎️ Telephony"]
        STT["🎙️ Speech-to-Text"]
        LLM["🤖 LLM"]
    end

    subgraph PROOF["AgroChain"]
        Builder["Canonical Payload + Hash"]
        Contract["ProofRegistry.sol"]
        Shardeum["⛓️ Shardeum EVM Testnet"]
    end

    Farmer --> Voice
    Farmer --> Mobile
    Farmer --> Web
    Staff --> StaffUI

    Voice --> Backend
    Mobile --> Backend
    Web --> Backend
    StaffUI --> Backend

    Backend --> Auth
    Backend --> Realtime
    Backend --> Relational
    Backend --> Vector

    Backend --> Mandi
    Voice --> Telephony
    Voice --> STT
    Voice --> LLM

    Relational --> Builder
    Builder --> Contract
    Contract --> Shardeum

🧠 AI / RAG Architecture

The project deliberately separates transactional truth from semantic knowledge retrieval.

Transactional data

Examples:

Farmer records

Slots

Bookings

Queue events

Procurement

Payments

Calls

These live in regular PostgreSQL tables.

Knowledge data

Examples:

FAQs

Procurement guidance

Agricultural knowledge

Reference information

Future indexed text content

These can be represented using embeddings in the knowledge_base table with pgvector.

flowchart TD
    Q["Farmer Question"] --> I["Intent Recognition"]
    I --> T{"Needs structured data?"}

    T -->|"Yes"| DB["PostgreSQL Transactional Data"]
    T -->|"Knowledge retrieval"| E["Future Embedding Generation"]

    E --> V["pgvector Similarity Search"]
    V --> C["Relevant Knowledge Context"]

    DB --> G["Response Generation"]
    C --> G

    G --> R["Hindi / English Voice Response"]

Current status: the repository is scaffolded for this architecture. Actual embedding generation, retrieval, and RAG business logic are intentionally not part of the skeleton.

⛓️ AgroChain Proof Architecture

AgroChain is designed as a proof layer, not as the primary application database.

sequenceDiagram
    participant DB as Supabase PostgreSQL
    participant API as KisanSetu Backend
    participant PB as Proof Builder
    participant SC as ProofRegistry.sol
    participant SH as Shardeum

    DB->>API: Important event occurs
    API->>PB: Send canonical event payload
    PB->>PB: Canonicalize payload
    PB->>PB: Generate event hash
    PB->>SC: recordProofEvent(eventHash, eventType)
    SC->>SH: Store proof on-chain
    SH-->>SC: Transaction confirmation
    SC-->>PB: Proof transaction/reference
    PB-->>API: Proof reference
    API-->>DB: Store proof event reference

Important design principle

PostgreSQL
    │
    ├── Stores application state
    ├── Stores farmer data
    ├── Stores procurement/payment records
    └── Stores proof-event metadata
              │
              ↓
         AgroChain
              │
              └── Anchors event proof

The blockchain is not a replacement for PostgreSQL.

📊 Core Data Model

The current schema is intentionally scaffolded and can be expanded by the team.

erDiagram
    FARMERS ||--o{ BOOKINGS : makes
    FARMERS ||--o{ QUEUE_EVENTS : has
    FARMERS ||--o{ PROCUREMENTS : owns
    FARMERS ||--o{ PAYMENTS : receives
    FARMERS ||--o{ CALLS : makes

    MANDIS ||--o{ SLOTS : provides
    MANDIS ||--o{ PRICE_CACHE : has

    SLOTS ||--o{ BOOKINGS : contains

    PROCUREMENTS ||--o{ PAYMENTS : results_in

    PROCUREMENTS ||--o{ PROOF_EVENTS : creates
    PAYMENTS ||--o{ PROOF_EVENTS : creates

    FARMERS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    MANDIS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    SLOTS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    BOOKINGS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    QUEUE_EVENTS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    PROCUREMENTS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    PRICE_CACHE {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    CALLS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    PROOF_EVENTS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        uuid id
        timestamp created_at
        timestamp updated_at
    }

🗂️ Knowledge Base + pgvector

The planned semantic knowledge layer uses a dedicated table:

knowledge_base
├── id
├── content
├── metadata
├── embedding
├── created_at
└── updated_at

The embedding field will use PostgreSQL's vector type through pgvector.

This avoids operating a separate Qdrant/vector-database service.

Why pgvector?

Requirement

pgvector

Works inside PostgreSQL

✅

Works with Supabase

✅

Relational + vector data together

✅

SQL filtering

✅

Semantic similarity search

✅

Separate vector infrastructure required

❌

Suitable for this project's initial scale

✅

🧩 Tech Stack

🏛️ Monorepo & Tooling

Technology

Purpose

Turborepo

Monorepo orchestration

pnpm Workspaces

Dependency/workspace management

TypeScript

Primary application language

Node.js

Backend/runtime ecosystem

⚙️ Backend

Technology

Purpose

Fastify

High-performance HTTP API

TypeScript

Type-safe backend

Supabase

Database/Auth/Realtime platform

PostgreSQL

Primary relational database

pgvector

Vector embeddings + semantic search

📞 Voice AI

Technology

Purpose

Twilio

Telephony / call infrastructure

Deepgram

Speech-to-text layer

Groq

LLM inference

TypeScript

Voice-agent package

📱 Mobile

Technology

Purpose

Expo

React Native development platform

React Native

Farmer mobile application

Expo Router

File-based navigation

TypeScript

Type-safe mobile code

🖥️ Web

Technology

Purpose

Next.js

Web applications

App Router

Next.js routing

Tailwind CSS

UI styling

TypeScript

Type-safe frontend

⛓️ Blockchain

Technology

Purpose

Solidity

Smart contract development

Hardhat

EVM development/deployment

Shardeum

Target EVM testnet

ProofRegistry.sol

Procurement/payment proof registry

🖼️ Technology Overview

┌───────────────────────────────────────────────────────────────┐
│                         KISANSETU                             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📞 Voice AI        📱 Mobile         🖥️ Dashboard            │
│  Twilio             Expo             Next.js                  │
│  Deepgram           React Native     Tailwind                 │
│  Groq               Expo Router                              │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                         BACKEND                               │
│                                                               │
│                    Fastify + TypeScript                       │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                       DATA LAYER                              │
│                                                               │
│       Supabase Auth     PostgreSQL     Realtime                │
│                                      +                        │
│                                    pgvector                   │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                       PROOF LAYER                             │
│                                                               │
│            Solidity + Hardhat + Shardeum                      │
│                                                               │
└───────────────────────────────────────────────────────────────┘

🧑‍🤝‍🧑 Team Ownership

Area

Owner(s)

backend/

Krishna, Vansh

voice-ai/

Krishna, Aarushi, Vansh

mobile-app/

Vansh

staff-dashboard/

Navya

web-dashboard/

Navya

agrochain/

Aarush

design/

Mehar

docs/

Shared — Krishna maintains

pitch/

Navya, Mehar

📁 Project Structure

kisancall-agrochain/
│
├── backend/                       # Fastify API + database layer
│   ├── src/
│   │   ├── auth/
│   │   │   └── roles.ts
│   │   ├── db/
│   │   │   └── schema.sql
│   │   └── routes/
│   │       ├── farmers.ts
│   │       ├── bookings.ts
│   │       ├── queue.ts
│   │       ├── status.ts
│   │       ├── staff.ts
│   │       ├── payments.ts
│   │       └── mandis.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── voice-ai/                      # Voice agent package
│   ├── src/
│   │   ├── prompts/
│   │   │   └── system-prompt.md
│   │   ├── intents/
│   │   │   └── intents.ts
│   │   ├── context/
│   │   │   └── context-object.ts
│   │   ├── tools/
│   │   │   ├── get-slot.ts
│   │   │   ├── get-queue.ts
│   │   │   ├── get-price.ts
│   │   │   └── get-payment.ts
│   │   └── tests/
│   │       └── scripted-calls/
│   ├── package.json
│   └── tsconfig.json
│
├── mobile-app/                    # Farmer mobile application
│   ├── app/
│   │   ├── register.tsx
│   │   ├── slot.tsx
│   │   ├── queue.tsx
│   │   ├── price.tsx
│   │   └── status.tsx
│   └── .env.example
│
├── staff-dashboard/               # Staff operations dashboard
│   ├── app/
│   │   ├── today/
│   │   ├── queue/
│   │   ├── arrivals/
│   │   ├── procurement/
│   │   └── payments/
│   └── .env.example
│
├── web-dashboard/                 # Minimal farmer web fallback
│   └── app/
│       ├── status/
│       └── queue/
│
├── agrochain/                     # Blockchain proof layer
│   ├── contracts/
│   │   └── ProofRegistry.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── src/
│   │   └── proof-builder/
│   ├── .env.example
│   ├── hardhat.config.ts
│   └── package.json
│
├── design/                        # Figma exports + design tokens
│   ├── tokens/
│   └── README.md
│
├── docs/                          # Shared project documentation
│   ├── API_CONTRACT.md
│   ├── DB_SCHEMA.md
│   └── PLAN.md
│
├── pitch/                         # Presentation material
│   └── README.md
│
├── package.json                   # Root workspace configuration
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace definition
├── .nvmrc                         # Node.js version
├── .gitignore
└── README.md

🔌 API Surface

The backend is organized around clear domain groups.

Method

Endpoint

Purpose

POST

/farmers

Farmer registration stub

POST

/bookings

Booking creation stub

GET

/farmers/:id/queue

Farmer queue status

GET

/farmers/:id/status

Farmer procurement/payment status

POST

/staff/arrivals

Staff arrival update

POST

/staff/procurement

Procurement update

PATCH

/payments/:id

Payment status update

GET

/mandis/:id/prices

Mandi price retrieval

GET

/health

Backend health check

Voice endpoints

Method

Endpoint

POST

/voice/webhook

POST

/voice/tool/get-slot

POST

/voice/tool/get-queue

POST

/voice/tool/get-price

POST

/voice/tool/get-payment

🗣️ Voice Agent Intents

The current intent scaffold includes:

get_slot
get_queue
get_price
get_payment
booking_create
booking_update

The future voice agent context includes:

farmer_id
language
preferred_mandi
crop
today_slot
queue_position
queue_eta
latest_price
price_date
procurement_status
payment_status
last_call_outcome

📊 Operational Status Model

The staff dashboard uses a consistent status vocabulary:

BOOKED
   ↓
ARRIVED
   ↓
IN_QUEUE
   ↓
PROCURED
   ↓
PAYMENT_PROCESSING
   ↓
PAID

stateDiagram-v2
    [*] --> BOOKED
    BOOKED --> ARRIVED
    ARRIVED --> IN_QUEUE
    IN_QUEUE --> PROCURED
    PROCURED --> PAYMENT_PROCESSING
    PAYMENT_PROCESSING --> PAID

This provides a common language between the backend, mobile app, dashboard and future voice interactions.

🔐 Roles

The backend role model currently defines:

Farmer
Operator
Supervisor
Admin

The purpose is to provide a common authorization vocabulary before detailed access-control rules are implemented.

🛡️ Security Principles

KisanSetu is designed around several basic security principles:

Never commit .env files or secrets.

Keep Supabase service-role credentials server-side.

Do not expose privileged backend credentials to the mobile app.

Use the public/anonymous Supabase key only where appropriate.

Keep blockchain deployer private keys outside source control.

Treat farmer and payment information as sensitive application data.

Use role-based authorization before exposing staff operations.

Keep proof-event data separate from the full transactional record.

The current repository is a scaffold. Production-grade authentication, authorization, validation, rate limiting, audit policies, and secret management are implementation work for later phases.

🧪 Development Philosophy

This repository intentionally starts as a contract-first skeleton.

That means the team agrees on:

folder ownership

API names

database table names

shared field names

voice intents

roles

status vocabulary

proof-event concepts

before implementing the complete business logic.

Why?

Because multiple developers are working simultaneously.

A shared contract prevents:

Developer A:
"I called it /farmer-status"

Developer B:
"I expected /farmers/:id/status"

Developer C:
"My database table is farmer_records"

Developer D:
"I used farmerId instead of farmer_id"

Instead, everyone builds against the same agreed interface.

🚧 Current Project Status

🟡 Scaffold / Architecture Phase

The repository currently focuses on:

Monorepo setup

Workspace structure

API contracts

Database schema skeleton

Voice-agent interfaces

Mobile route/page skeletons

Dashboard skeletons

AgroChain contract/service skeleton

Documentation

pgvector architecture

Not yet implemented in the skeleton

Real Supabase database connections

Production authentication flows

Real Twilio integration

Real Deepgram integration

Real Groq integration

Actual embedding generation

Actual pgvector similarity retrieval

Complete RAG pipeline

Production payment integration

Production mandi API integration

Live Shardeum deployment

Complete business logic

This distinction is intentional.

🚀 Getting Started

Prerequisites

Install:

Node.js

pnpm

Git

Check versions:

node --version
pnpm --version
git --version

Clone

git clone <YOUR_REPOSITORY_URL>
cd kisancall-agrochain

Install dependencies

pnpm install

Start development

pnpm dev

Turborepo will orchestrate the workspace development processes.

🔑 Environment Variables

Each package contains its own .env.example.

Backend

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATA_GOV_IN_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
DEEPGRAM_API_KEY=
GROQ_API_KEY=

Mobile App

EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

Staff Dashboard

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

AgroChain

SHARDEUM_RPC_URL=
DEPLOYER_PRIVATE_KEY=

Never commit actual secrets. Use .env.example files as templates only.

🧰 Useful Commands

# Install all workspace dependencies
pnpm install

# Start development
pnpm dev

# Build workspaces
pnpm build

# Run type checks
pnpm typecheck

# Run linting where configured
pnpm lint

Available scripts may evolve as each workspace moves from scaffolding to implementation.

🧭 Development Roadmap

timeline
    title KisanSetu Development Roadmap

    Phase 1 : Repository Skeleton
             : Workspace setup
             : API contracts
             : DB schema
             : Architecture

    Phase 2 : Core Data Layer
             : Supabase
             : Authentication
             : Database
             : Realtime

    Phase 3 : Voice AI
             : Telephony
             : Speech-to-text
             : Intent handling
             : Tool calling

    Phase 4 : Farmer Experience
             : Mobile app
             : Slot
             : Queue
             : Price
             : Status

    Phase 5 : Staff Operations
             : Dashboard
             : Arrivals
             : Procurement
             : Payments

    Phase 6 : Knowledge Layer
             : Knowledge ingestion
             : Embeddings
             : pgvector
             : Retrieval

    Phase 7 : AgroChain
             : Canonical events
             : Hashing
             : ProofRegistry
             : Shardeum anchoring

    Phase 8 : Integration
             : End-to-end testing
             : Demo flows
             : Performance
             : Security

🧑‍💻 Contribution Workflow

Every contributor should:

Understand the module they own.

Read the relevant documentation.

Avoid changing shared contracts without discussing them.

Keep changes scoped to their module.

Test their work locally.

Update documentation when a shared contract changes.

Open a pull request with a clear description.

Shared contracts

Before changing any of these:

API endpoint names

request/response shapes

database table names

shared field names

status vocabulary

voice intents

proof event names

discuss the change with the team.

📚 Documentation

Document

Purpose

docs/API_CONTRACT.md

Shared backend and voice API contracts

docs/DB_SCHEMA.md

Shared database schema

docs/PLAN.md

Work distribution and execution plan

design/README.md

Design assets and tokens

pitch/README.md

Pitch/deck documentation

🎨 Design

The design/ package is intentionally not a code package.

It contains:

design/
├── README.md
└── tokens/

The folder is intended for:

Figma exports

Design tokens

UI references

Visual system documentation

Future design assets

🧠 Why This Architecture?

One backend

Instead of creating independent backends for every client:

Mobile ─────┐
Voice ──────┼──→ Fastify Backend ──→ Supabase
Dashboard ──┤
Web ────────┘

This keeps business rules centralized.

One source of transactional truth

PostgreSQL stores the application's operational state.

Farmer
Slot
Booking
Queue
Procurement
Payment

All clients consume the same underlying state.

pgvector instead of a separate vector database

The project uses PostgreSQL + pgvector as the planned semantic knowledge layer.

This reduces infrastructure complexity and keeps relational filtering and semantic retrieval close to the same data platform.

Blockchain only where it adds value

Not every database operation belongs on-chain.

Instead:

Normal application data → PostgreSQL

Important verifiable events → Hash → Shardeum

This keeps the system practical while still providing a proof layer.

🌱 Example Future Interaction

Farmer asks:

"Mera procurement slot kab hai?"

System:

Voice
  ↓
Speech-to-Text
  ↓
Intent: get_slot
  ↓
Backend
  ↓
Farmer + Booking + Slot
  ↓
Response
  ↓
Text-to-Speech
  ↓
Farmer hears answer

Farmer asks:

"Mera payment aa gaya?"

Voice
  ↓
Intent: get_payment
  ↓
Backend
  ↓
Payment record
  ↓
Status
  ↓
Voice response

Procurement completes:

Procurement Completed
        ↓
Canonical Event
        ↓
SHA/Keccak-style event hash
        ↓
ProofRegistry
        ↓
Shardeum
        ↓
Proof Reference

🏆 Why KisanSetu?

KisanSetu is not intended to be just another farmer-facing chatbot.

The architecture combines:

Accessibility

→ Voice-first interaction

Operational visibility

→ Slot + queue + procurement + payment tracking

Unified data

→ Supabase PostgreSQL

AI knowledge retrieval

→ pgvector

Staff operations

→ Dedicated dashboard

Verifiability

→ AgroChain proof anchoring

The goal is a system that is simple for the farmer, useful for staff, and technically verifiable underneath.

📈 Future Possibilities

The architecture can later support:

More Indian languages

Additional crops

More procurement centers

Automated farmer notifications

Advanced price intelligence

Better queue prediction

Voice-based booking

Payment alerts

Offline-first mobile workflows

Richer RAG knowledge

Analytics and operational forecasting

Additional blockchain proof events

Multi-state deployment

These are future directions, not promises of the current scaffold.

👥 Team

Member

Responsibility

Krishna

Backend, voice orchestration, architecture, documentation

Vansh

Database, mobile app, queue, telephony

Aarushi

Conversational AI, intents, prompts, knowledge layer

Navya

Staff dashboard, web dashboard, pitch/research

Aarush

AgroChain, Solidity, proof layer

Mehar

UI/UX, design system, visual assets

📌 Project Principles

Farmer-first.

Voice-first, not smartphone-only.

One source of transactional truth.

AI assists; it does not invent operational facts.

Blockchain proves important events; it does not replace the database.

Shared contracts before parallel implementation.

⭐ Support the Project

If you find KisanSetu interesting:

⭐ Star the repository

🐛 Open an issue

💡 Suggest improvements

🔀 Submit a pull request

📢 Share the project

📄 License

License information will be added when the project license is finalized.

<p align="center">
  <strong>🌾 KisanSetu</strong>
  <br>
  <em>Connecting farmers to procurement with voice, data, and verifiable trust.</em>
</p>
