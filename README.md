# Weava

**Weava** is a workflow automation platform for building, configuring, and executing node-based workflows in a visual editor. It combines **trigger nodes**, **execution nodes**, **credential management**, **execution tracking**, and **background orchestration** into a single app.

---

## Overview

Weava lets users:

- Create and manage workflows
- Build workflow graphs visually with **React Flow / XYFlow**
- Configure **trigger** and **execution** nodes
- Execute workflows manually or from inbound events
- Track execution history and node-level runtime status
- Manage provider credentials
- Run background jobs through **Inngest**
- Persist workflow graphs and runtime data with **Prisma**

---

## Core Features

### Workflow authoring
- Workflow listing with search and pagination
- Workflow creation, rename, delete, and update
- Visual workflow editor
- Node insertion via selector UI
- React Flow-compatible node/edge persistence
- Execution entry from the workflow editor

### Trigger nodes
- **Manual trigger**
- **Stripe trigger**
- **Google Form trigger**

### Execution nodes
- **HTTP request**
- **OpenAI**
- **Gemini**
- **Anthropic**
- **Discord**
- **Slack**

### Execution tracking
- Execution list page
- Execution detail page
- Realtime node status updates
- Shared execution node rendering contract

### Credentials
- Credential configuration pages and UI
- Credential hooks and feature-level state plumbing
- Server router integration and prefetch support

### Platform
- Authentication and access boundaries
- tRPC client/server transport
- Prisma schema and migrations
- Sentry instrumentation
- Inngest orchestration and channel adapters

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **tRPC**
- **Prisma**
- **PostgreSQL**
- **Inngest**
- **@xyflow/react** / React Flow
- **Tailwind CSS**
- **shadcn/ui**
- **Sentry**

---

## Architecture Summary

The project is organized around a few major feature areas:

- `features/workflows/`
  - workflow listing
  - workflow editor lifecycle
  - workflow mutations and execution entry
- `features/executions/`
  - execution list/detail pages
  - provider execution nodes
  - runtime executors and realtime status
- `features/triggers/`
  - trigger node implementations
  - webhook ingestion routes
- `features/credentials/`
  - credential pages, hooks, and server router
- `features/auth/`
  - auth API route
  - login/signup pages
- `config/`
  - node registration and shared configuration
- `prisma/`
  - schema and migrations

---

## Supported Nodes

### Trigger nodes
- `manual_trigger`
- `stripe_trigger`
- `google_form_trigger`

### Execution nodes
- `http_request`
- `openai`
- `gemini`
- `anthropic`
- `discord`
- `slack`

---

## How the System Works

### 1. Workflow creation and browsing
Workflows are listed through a server-backed query flow with:
- page-based pagination
- search filtering
- prefetch support
- tRPC-backed mutations and queries

### 2. Visual editing
The editor uses a node registry that maps workflow node types to React components. Nodes are inserted through a selector and rendered through shared React Flow primitives.

### 3. Graph persistence
Workflow updates save the full graph snapshot:
- nodes
- edges / connections
- metadata updates

> **Important:** documented behavior indicates workflow updates replace the stored graph rather than applying partial diffs.

### 4. Execution
Workflows can be executed from the app or triggered by inbound events, depending on the trigger node used.

### 5. Background orchestration
Execution work is delegated to **Inngest** functions and provider-specific channels.

### 6. Runtime visibility
Execution nodes publish status updates such as:
- `initial`
- `loading`
- `success`
- `error`

These are surfaced in the editor and execution views.

---

## Realtime / Background Channels

Documented Inngest channel adapters include:

- Anthropic
- Gemini
- Discord
- Google Form
- HTTP request

These support:
- background execution
- event handling
- realtime status token flows

---

## Credentials Model

Credential surfaces are documented for:
- pages and UI components
- hooks and params
- feature-level state plumbing
- server router and prefetch pattern

Credentials are used by provider nodes such as:
- OpenAI
- Anthropic
- Google API / Gemini

---

## Authentication

The app includes:
- auth API route
- auth library integration
- login page
- signup page

User access to workflows, executions, and credentials is scoped to the authenticated user.

---

## Data Layer

Persistence is handled with **Prisma** and a **PostgreSQL** database.

Documented persistence areas include:
- Prisma schema
- core database utilities
- migration history for:
  - auth
  - workflows
  - React Flow tables
  - node updates

---

## API Layer

The app uses **tRPC** for client/server communication.

Documented tRPC areas include:
- initialization
- server bridge
- client provider
- query client
- router integration for:
  - workflows
  - executions
  - credentials

---

## Install

> **Stubbed from docs:** exact package manager scripts are not fully enumerated in the available documentation, but `pnpm` is referenced throughout.

### Prerequisites

- **Node.js** `>= 18` recommended
- **pnpm**
- **PostgreSQL**
- Optional:
  - **Inngest CLI**
  - **Sentry** account
  - provider API credentials for integrations you want to test

### Clone and install

```bash
git clone https://github.com/PheonixCodder/Weava.git
cd weava
pnpm install
