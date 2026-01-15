---
description: Organize code into horizontal slices (lib) and vertical slices (features) with clear boundaries
---

# Directory Structure

How we store and organize our code is vital.

We optimize for few things with it:

- horizontal and vertical code slices
- code co-location
- reducing coupling between modules
- black-boxing knowledge of the system

## Concepts

### Horizontal and vertical code slices

Horizontal code slices are the pieces of code that are used across many
features. They usually live in the `lib` directory, or near the root of the
project, within scoped directories (scoped meaning describing the type of code,
e.g. "components", "atoms"). They cannot import anything from features - and
they should be as atomic as possible. The codebase should form an acyclic directed
graph.

Vertical code are the features - following the code co-location concept below.

### Code co-location

Working on a feature should not require you to understand the entire codebase.
It should also mean that it doesn't matter if you're working on API calls or
local state management, if it concerns the same feature, you should stay within
the same directory or very close to it. This prevents multiple people from
"stepping on each other's toes", and simplifies the black-boxing of the system.

### Black-boxing knowledge of the system

The codebase should be as black-boxed as possible. Meaning, at each leaf of the
structure (dependency tree) you shouldn't need to understand the feature composition,
dependencies, or algorithms. You should just see inputs and outputs of it.

### Reduce coupling between modules

Architecture-wise, feature / module is a unit that addresses a specific
problem / provides value. It should be as independent as
possible. Features can be composed from other features, where a set of blocks
builds something bigger. But the blocks shouldn't be used outside of the parent
feature.

This means, that a well structured codebase's features (modules) will build a
tree, where root is the entry point of the application.

## Technical implementation

For different languages and different frameworks, the implementation may vary.
But the concepts are the same. Couple of examples:

### Typescript - Electron + Next.js

```bash
.
├── backend
│   ├── features
│   │   ├── assistant
│   │   ├── chat
│   │   ├── emails
│   │   ├── meetings
│   │   ├── onboarding
│   │   ├── profile
│   │   ├── reminders
│   │   ├── search
│   │   ├── settings
│   │   ├── task
│   │   ├── transactions
│   │   └── workspaces
│   ├── functions.test.ts
│   ├── functions.ts
│   ├── lib
│   │   ├── ai
│   │   ├── cloudconvert.test.ts
│   │   ├── cloudconvert.ts
│   │   ├── drizzle
│   │   ├── elevenlabs.ts
│   │   ├── google
│   │   ├── inngest
│   │   ├── inngest.ts
│   │   ├── inversify.test.ts
│   │   ├── inversify.ts
│   │   ├── langfuse.ts
│   │   ├── logger.ts
│   │   ├── otel.ts
│   │   ├── pg-transaction.ts
│   │   ├── posthog.ts
│   │   ├── recall
│   │   ├── resend
│   │   ├── sentry.ts
│   │   ├── storage.ts
│   │   ├── supabase
│   │   └── symbols.ts
│   ├── root.ts
│   ├── tests
│   │   ├── database
│   │   ├── factories
│   │   ├── global-setup.ts
│   │   ├── setup.ts
│   │   └── utils
│   ├── trpc.ts
│   ├── types
│   │   └── sql.d.ts
│   └── utils
│       ├── base-service.ts
│       ├── fetch-retry.test.ts
│       ├── fetch-retry.ts
│       ├── is-production.ts
│       └── zod-utils.ts
├── CHANGELOG.md
├── desktop
│   ├── assets
│   │   ├── dmg-background.tiff
│   │   └── icons
│   ├── dmg-background.tiff
│   ├── electron.vite.config.ts
│   ├── entitlements.todesktop.plist
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── main
│   │   ├── preload
│   │   ├── renderer
│   │   └── shared
│   ├── tailwind.config.ts
│   ├── todesktop.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── tsconfig.web.json
├── docker-compose.dev.yaml
├── drizzle.config.ts
├── entitlements.todesktop.plist
├── eslint.config.js
├── instrumentation-client.ts
├── knip.config.ts
├── logdy-config.json
├── next.config.ts
├── next-env.d.ts
├── opencode.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── postgrestools.jsonc
├── public
│   └── landing
│       ├── emails-sync.png
│       ├── logo.png
│       ├── logos
│       ├── meeting-bots.png
│       ├── opengraph-image.jpg
│       ├── scape-hq.jpg
│       ├── scape-logo-small-black.svg
│       ├── screenshots.svg
│       ├── signatures
│       ├── small-scape-logo.svg
│       ├── summary.svg
│       ├── tasks.svg
│       ├── top-desktop.png
│       ├── updates-on-the-go.png
│       └── waitlist-background.png
├── README.md
├── scripts
│   ├── dev
│   │   ├── add-user-locally.ts
│   │   ├── backup-prod-db.sh
│   │   ├── cleanup-test-workspaces.ts
│   │   ├── create-internal-users.ts
│   │   ├── create-user.ts
│   │   ├── forward-webhooks.ts
│   │   ├── google-webhook-test.ts
│   │   ├── impersonate-user.ts
│   │   ├── load-prod.sh
│   │   ├── restore-local-db.sh
│   │   └── svix
│   ├── migrations
│   │   └── sync-all-google-accounts.ts
│   ├── preview
│   │   └── impersonate-user.ts
│   └── production
│       ├── add-user.ts
│       ├── add-workspace.ts
│       ├── enable-gmail-features.ts
│       ├── impersonate-user.ts
│       ├── run-email-classification-eval.ts
│       ├── run-executive-assistant-eval.ts
│       └── send-user-onboarding-email.ts
├── src
│   ├── app
│   │   ├── (api)
│   │   ├── (app)
│   │   ├── apple-icon.png
│   │   ├── favicon.ico
│   │   ├── global-error.tsx
│   │   ├── icon.png
│   │   └── (landing)
│   ├── assets
│   │   ├── default-company-icon.svg
│   │   ├── icons
│   │   ├── logo
│   │   ├── recording-icon.svg
│   │   ├── scape-thinking.svg
│   │   └── summary-icon.svg
│   ├── components
│   │   ├── analytics-scripts.tsx
│   │   ├── cookie-overlay.tsx
│   │   ├── error-boundary-wrapper.tsx
│   │   ├── svg-icon.tsx
│   │   └── ui
│   ├── globals.css
│   ├── instrumentation.ts
│   ├── landing
│   │   ├── assets
│   │   ├── components
│   │   ├── emails
│   │   ├── server-actions
│   │   └── views
│   ├── lib
│   │   ├── analytics.ts
│   │   ├── cookie-consent.ts
│   │   ├── env
│   │   ├── supabase
│   │   └── trpc
│   ├── middleware.ts
│   └── utils
│       ├── arrays.ts
│       ├── cn.ts
│       └── zod-utils.ts
├── supabase
│   ├── config.toml
│   ├── migrations
│   └── seed.sql
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── vitest.config.ts
```

In this example, there is two important parts of the codebase - desktop and backend.
Functionality is scoped into features, which are grouping the code. Top level
directory contains the configuration files.

For code, we follow - more or less - the `bulletproof-react` patterns. One of
the most important thing is the functionailty -> feature -> type of code
structure. For us, folder that are allowed within the feature are changing
depending on the project. E.g. `api` folder is not necessary if you're using
`jotai-query` or `trpc`. For `jotai`, a new type of folder is better, `atoms`.

Try to follow existing patterns - but also spot patterns in the code.

### Multi-app Typescript project

```bash
.
├── AGENTS.md
├── apps
│   ├── backend
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   ├── expo
│   │   ├── app
│   │   ├── app.json
│   │   ├── assets
│   │   ├── babel.config.js
│   │   ├── eas.json
│   │   ├── index.js
│   │   ├── metro.config.js
│   │   ├── package.json
│   │   ├── scripts
│   │   ├── tsconfig.json
│   │   └── types
│   ├── next
│   │   ├── app
│   │   ├── components
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   ├── next-env.d.ts
│   │   ├── package.json
│   │   ├── public
│   │   ├── tsconfig.json
│   │   └── types.d.ts
│   └── oscar-wrapper
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── docs
│       ├── OSCAR-code
│       ├── README.md
│       ├── src
│       └── wrapper.pro
├── biome.json
├── ci
│   ├── docker-compose.yml
│   ├── minio.traefik.yml
│   └── volumes
│       ├── minio_data
│       ├── tailscale_state
│       └── traefik
├── docker-compose.yml
├── Dockerfile
├── opencode.json
├── package.json
├── packages
│   ├── app
│   │   ├── api
│   │   ├── components
│   │   ├── features
│   │   ├── index.ts
│   │   ├── lib
│   │   ├── package.json
│   │   ├── providers
│   │   ├── tests
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   ├── config
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── types
│   ├── env
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   ├── server
│   │   ├── drizzle.config.ts
│   │   ├── oscar-cli-wrapper.sh
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   └── ui
│       ├── images
│       ├── package.json
│       ├── src
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── rules
│   ├── forbid-console-log.yml
│   ├── forbid-logical-and-jsx.yml
│   ├── forbid-next-api-routes.yml
│   └── forbid-process-env.yml
├── sgconfig.yml
├── tools
│   ├── check_prod_s3.sh
│   ├── firmware
│   │   ├── README.md
│   │   └── scripts
│   └── upload_local_card.py
└── tsconfig.base.json
```

In this example, there is more than one important part of the codebase. We have
a backend, a web-frontend and a mobile app (Expo). In this project, we have
an `apps` folder (what gets deployed) and a `packages` folder (actual business
logic).

In `app` folder, that's the shared code between mobile and web - we follow the
exact same structure, with `features` and `lib` folders. While the `apps`/`packages`
split is subjective, the co-location based on features is a vital and non-negotiable
rule for any project.

In this example, we have additional packages. This sometimes helps with
compilation (if e.g. performance is subpar and we want to only reevalute
partials or when using different JSX pragmas). Overall we shouldn't separate
anything unless it's absolutely necessary.
