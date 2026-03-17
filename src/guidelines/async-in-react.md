---
description: HTTP requests, timers, any async operation in React
---

# Asynchronous operations in React

Every asynchronous operation in React is a state machine. A network request, a
permission prompt, a timer, a file upload, a geolocation lookup - each one
follows the same pattern: it starts idle, transitions to loading, then resolves
to success or error. And if you already have data, a re-fetch adds yet another
state (loading while stale data is shown).

## Goal

When reviewing code, look for async operations that are handled manually.
Verify that proper async state management tools are used instead of hand-rolled
`useEffect` + `useState` combinations. Flag cases where loading, error, or
revalidation states are missing or incorrectly managed.

## The state machine problem

Any async operation needs at least these states handled:

- **Idle** - nothing has happened yet
- **Loading** - the operation is in progress (no prior data)
- **Error** - the operation failed
- **Success** - the operation completed, data is available
- **Reloading** - the operation is in progress again (stale data is shown)

Manually tracking this with `useState` and `useEffect` is error-prone. You
inevitably forget edge cases: race conditions between requests, cleanup on
unmount, deduplication of identical requests, retry logic, cache invalidation.
The result is bugs that are hard to reproduce and code that is hard to maintain.

```tsx
// Manual approach - error-prone, incomplete, unmaintainable
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchUser(userId)
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Still missing: retry, refetch on focus, deduplication,
  // cache, stale-while-revalidate, optimistic updates...
}
```

This is ~30 lines to handle a single fetch, and it's still incomplete. Each new
async operation multiplies this boilerplate. Across a codebase, the
inconsistencies compound.

## The solution: use a dedicated async state manager

Use **TanStack Query** (`@tanstack/react-query`) as the default solution for
managing async state in React. It handles the full state machine out of the box:
loading, error, success, reloading, caching, deduplication, retries, background
refetching, and more.

```tsx
// TanStack Query - complete, correct, declarative
function UserProfile({ userId }: { userId: string }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (query.isPending) return <Spinner />;
  if (query.isError) return <ErrorMessage error={query.error} />;

  return <Profile user={query.data} />;
}
```

Depending on the project, other tools may fill this role: **RTK Query**
(Redux Toolkit), **useSWR** (Vercel), **Apollo Client** (GraphQL). Use
whatever is already established in the project - but always use _something_.
Never roll your own.

### It's not just HTTP requests

This applies to **any** async operation, not just data fetching:

- **Browser permissions** (camera, microphone, notifications, geolocation)
- **File operations** (uploads, downloads, reads)
- **Timers and animations** (debounced searches, polling)
- **Device APIs** (Bluetooth, NFC, sensors)
- **Authentication flows** (OAuth redirects, token refresh)

If it's async, it has the same state machine. Treat it the same way.

```tsx
// Geolocation as a query - same pattern, same benefits
const locationQuery = useQuery({
  queryKey: ['geolocation'],
  queryFn: () =>
    new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    ),
  staleTime: 30_000,
});
```

## Alternative approach: Suspense and Error Boundaries

React has a built-in answer to this problem: **Suspense** for loading states
and **Error Boundaries** for error states. Conceptually, it's the same state
machine, but approached from the framework level rather than from hooks.

```tsx
// Suspense approach - the framework handles the state machine
function App() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Spinner />}>
        <UserProfile userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function UserProfile({ userId }: { userId: string }) {
  // useSuspenseQuery throws a promise while loading (caught by Suspense)
  // and throws errors (caught by ErrorBoundary)
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // No loading/error checks needed - only renders when data is ready
  return <Profile user={user} />;
}
```

Suspense inverts the control: the component only renders when data is available,
and the loading/error states are handled by parent boundaries. This is powerful
and aligns with React's declarative model.

However, Suspense for data fetching is not yet widely adopted in the ecosystem.
Most projects don't have the boundary infrastructure in place, and mixing
Suspense and non-Suspense patterns in the same codebase creates inconsistency.

**For now, prefer TanStack Query's hook-based approach as the default.** Use
Suspense when the project has already adopted it consistently or when building
new feature boundaries from scratch (TanStack Query supports both via
`useSuspenseQuery`).

## What to look for

1. **Manual `useEffect` + `useState` for async operations.** This is the most
   common violation. Suggest replacing with TanStack Query or the project's
   established async state manager.

2. **Missing states.** A component that fetches data but has no loading
   indicator or no error handling. The state machine is incomplete.

3. **Race conditions.** When a dependency (like `userId`) changes, is the
   previous request cancelled? Manual implementations almost never handle this.

4. **Duplicated fetch logic.** The same endpoint being fetched in multiple
   components without shared cache or deduplication.

5. **Inconsistent patterns.** Some components using TanStack Query, others
   using raw `useEffect`. Converge on one approach.

## Instructions

When validating this guideline:

1. Search for `useEffect` calls that contain async operations (fetch, axios,
   promises, `async/await`). These are almost always candidates for TanStack
   Query.

2. Check that every async operation has loading, error, and success states
   properly handled in the UI.

3. Verify that the project's established async state manager is used
   consistently. If TanStack Query is installed, all new async operations
   should use it.

4. Look for opportunities to consolidate duplicate fetch logic into shared
   query hooks.

5. Don't demand Suspense adoption if the project isn't using it. Do suggest it
   when building new, isolated feature boundaries where it would simplify the
   component tree.
