# Technology Stack

## Core Philosophy

Keep it simple. Prefer solutions in this order:

1. Changes to your own codebase
2. Changes to your database schema
3. Adding a library
4. Modifying infrastructure you own
5. Adding new infrastructure you own
6. External services (last resort)

Before adding complexity (caches, queues, new services), first try to re-architect your code. One PostgreSQL instance can handle queues, background jobs, and much more.

In the LLM-assisted era, coding missing functionality is often faster than integrating third-party services.

## TypeScript Projects

### Framework Selection

Choose based on rendering needs:

- **SSR/SSG apps:** TanStack Start or Next.js
- **Client-side SPAs:** TanStack Router with Vite

When using TanStack Router or Remix, structure routes as a feature (`features/routing/`) to colocate layouts, guards, and route definitions.

### Core Stack

- PostgreSQL 18+ with UUIDv7 primary keys
- Drizzle ORM
- tRPC + @tanstack/react-query + superjson
- better-auth
- Biome (linting + formatting)
- Zod, date-fns, react-hook-form
- shadcn + Tailwind CSS
- @t3-oss/env-nextjs (or @t3-oss/env-core) for config

### When Needed

- vitest (testing), resend (email), stripe (payments), pg-boss (background jobs)

## Library Selection Principles

Prefer libraries that align with functional programming principles:

1. **Pure functions over methods** - Functions that take input and return output without side effects. The implementation can be ignored once you understand the interface.

2. **Immutability over mutation** - No need to track state changes in your head.

3. **Tree-shakeable** - Pure functions are easier for bundlers to eliminate when unused.

4. **Leverage the platform** - When a web standard exists (or is emerging), prefer it over libraries. Standards are stable, well-documented, and won't be abandoned.

### Date/Time

Prefer in this order:

1. **Temporal API** - Use when available (emerging JS standard). Zero dependencies, platform-native.
2. **date-fns** - Pure functions, tree-shakeable, immutable. Each function is independent.
3. Avoid: dayjs, moment.js - Method chaining creates implicit state, harder to tree-shake.

```typescript
// date-fns: pure function, easy to understand in isolation
import { addDays, format } from 'date-fns'
const nextWeek = addDays(new Date(), 7)
const formatted = format(nextWeek, 'yyyy-MM-dd')

// Temporal (when available): platform-native, no dependencies
const nextWeek = Temporal.Now.plainDateISO().add({ days: 7 })
const formatted = nextWeek.toString()
```

The same principles apply when selecting libraries for other domains (styling, state management, routing, etc.). Ask: Is it functional? Immutable? Tree-shakeable? Is there a platform standard?

## Elixir Projects

- Use Ash Framework when possible (reference the framework book)
- One PostgreSQL instance goes very far—avoid additional infrastructure
- Code solutions before reaching for external dependencies

## JavaScript Projects

Migrate to TypeScript first, then follow the TypeScript guidelines.
