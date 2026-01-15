---
description: Place code as close to where it's relevant as possible
---

# Colocation

Place code as close to where it's relevant as possible. Things that change together
should be located as close together as reasonable.

This applies to tests, state, utilities, components, and documentation. When code is
colocated, it's easier to find, easier to maintain, and harder to forget.

## Goal

When reviewing code, ask: "If I change X, where else do I need to look?". Minimize the
number of places a developer must check. Reduce context switching between files and
directories.

## What to look for

### Tests

Tests should live next to the code they verify. When you modify a module, the tests
for that module should be immediately visible. If tests are in a separate `test/`
directory, developers may not realize the module is tested or forget to update tests.

### State

State should live close to where it's used. Moving state up "just in case" creates
unnamed dependencies and makes it harder to understand data flow. Keep state local
until there's an actual need to share it.

### Utilities

Don't extract utilities too early. A function used in one place should stay in that
file until it's clearly needed elsewhere. Extract only when you've felt the pain of
duplication. This avoids orphaned utilities that accumulate dead code.

### Components and templates

Keep components with their templates and styles. In LiveView, this means the HEEx
template should be in the same directory and clearly associated. In React/Next.js,
colocated styles and hooks follow the same principle.

### Documentation

Module documentation (`@moduledoc`, `@doc`) belongs in the same file. Cross-references
and integration guides can live in a `README.md` within the feature directory.

## Why

Colocation prevents orphaned code, reduces tribal knowledge, and makes refactoring
easier. When everything related to a feature is together, you can understand it in
one place. You won't forget to update the test when changing the implementation,
or delete the utility when removing the component that used it.

Separation for its own sake creates maintenance burden. The code that changes
together should live together.

## Instructions

When validating this guideline:

1. Check if tests are near the code they test, not in a separate directory tree.

2. Look for utilities that are only used in one place. Suggest keeping them local
   rather than extracting prematurely.

3. Verify state is kept as local as possible. Question state lifted without clear
   justification.

4. Ensure component, template, and styles are together or clearly associated.

5. Check that `@moduledoc` and `@doc` annotations are present and accurate.

6. When code is scattered, suggest consolidating related files into a single
   directory or feature folder.

---

## TypeScript / JavaScript

- **Tests**: Place `.test.ts` or `.spec.ts` files next to the source file:

  ```
  user.ts
  user.test.ts
  user.types.ts
  ```

- **Components**: Keep component, styles, and tests in the same directory:

  ```
  Button/
    Button.tsx
    Button.module.css
    Button.test.tsx
    index.ts
  ```

- **Utilities**: Don't create a `utils/` folder at the project root for utilities
  used by only one module. Keep them in the same file or adjacent.

- **Hooks**: Custom hooks live next to the components that use them, not in a
  centralized `hooks/` directory.

## Elixir

- **Tests**: Place `*.exs` test files next to the module they test:

  ```
  lib/my_app/users/user.ex
  test/my_app/users/user_test.exs
  ```

- **LiveView**: Keep the LiveView module and its template in the same directory.
  Templates are `.html.heex` files in the same `live/` directory:

  ```
  live/user_live.ex
  live/user_live.html.heex
  ```

- **Context modules**: Keep related domain logic in one context. Don't split
  across multiple directories just for the sake of separation.

- **Ash resources**: Resource definitions, actions, and validations for the same
  entity should be in one module or clearly related files, not scattered.

- **Docs**: Use `@moduledoc` and `@doc` attributes in the same file. Feature-level
  documentation can be a `README.md` in the context directory.

## General exceptions

- **E2E tests** that span multiple features belong at the project root.

- **Integration tests** covering multiple modules can live in a dedicated directory.

- **Shared utilities** used across many modules can be centralized, but verify they
  are actually used widely before creating them.
