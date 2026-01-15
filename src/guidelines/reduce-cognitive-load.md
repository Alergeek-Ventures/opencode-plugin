# Reduce cognitive load

Cognitive load is how much a developer needs to think in order to complete a
task. The average person can hold roughly four chunks in working memory. Once
the cognitive load reaches this threshold, it becomes much harder to understand
things.

There are two types of cognitive load:

- **Intrinsic** - caused by the inherent difficulty of a task. Can't be reduced.
- **Extraneous** - created by the way information is presented. Can be reduced.

We focus on reducing extraneous cognitive load - complexity that is not inherent
to the problem we're solving.

## Goal

When reviewing code, ask: "How much does a developer need to hold in their head
to understand this?" Look for patterns that force readers to juggle too many
concepts at once.

If a new team member would be confused for more than ~40 minutes straight when
reading the code, there's room for improvement. Familiarity is not simplicity -
code should be understandable, not just familiar to its author.

## What to look for

### Complex conditionals

When multiple conditions are chained together, each one adds to working memory:

```elixir
# High cognitive load - must track all conditions simultaneously
if val > limit && (admin? || manager?) && (active? && !banned?) do

# Lower cognitive load - self-documenting intermediate variables
valid? = val > limit
authorized? = admin? || manager?
allowed? = active? && !banned?
if valid? && authorized? && allowed? do
```

### Nested control flow

Deeply nested code forces you to remember all the preconditions:

```elixir
# High cognitive load - must track nesting context
def process(data) do
  if valid?(data) do
    if authorized?(data) do
      do_work(data)
    end
  end
end

# Lower cognitive load - focus on happy path
def process(data) do
  unless valid?(data), do: {:error, :invalid}
  unless authorized?(data), do: {:error, :unauthorized}
  do_work(data)
end
```

### Too many shallow modules

Having too many small modules can be worse than fewer deep ones. Not only do you
have to keep each module's responsibilities in mind, but also all their
interactions. Jumping between shallow components is mentally exhausting.

**Deep module** - simple interface, complex functionality hidden inside.
**Shallow module** - interface is complex relative to the small functionality it provides.

The best components provide powerful functionality yet have a simple interface.
Prefer fewer modules with clear public APIs over many tiny modules with lots of
interconnections.

### Magic values

Numeric codes or cryptic strings force readers to look up meanings:

```elixir
# Requires lookup/memory
%{status: 1}

# Self-documenting
%{status: :pending_review}
```

### Unnecessary abstraction layers

Each layer of indirection costs mental effort. Don't add abstraction for
architecture's sake - add it only when there's a concrete, practical reason.
Layers that just pass data through without transformation add cognitive load
without providing value.

### Mutable state and side effects

When reading code with mutable state, you must mentally track how values change
over time. Each mutation adds to working memory. Pure functions and immutable
data reduce this burden significantly - they allow you to black-box.

## Why

We spend far more time reading and understanding code than writing it. Confusion
costs time and money. Every "clever" trick incurs a learning penalty for
everyone else.

Complexity tends to creep in incrementally. When there are only 2-3 conditions,
adding another doesn't seem to matter. By the time there are 20-30, adding one
more still doesn't seem to matter. There is no "simplifying force" acting on the
codebase other than deliberate choices.

A little copying is better than a little dependency. Importing large libraries
for small utilities creates cognitive debt when things go wrong and you need to
debug through unfamiliar code.

## Instructions

When validating this guideline:

1. Read through the code and note where you have to pause to understand what's
   happening. These are cognitive load hotspots.

2. Check for deeply nested control flow. Suggest early returns or guard clauses
   to flatten the structure.

3. Look for complex boolean expressions. Suggest extracting them into
   meaningfully named variables.

4. Identify magic numbers or status codes. Suggest self-describing atoms or
   named constants.

5. Question abstractions that don't seem to hide complexity. If understanding
   the abstraction requires understanding all its parts anyway, it may not be
   helping.

6. Don't demand changes blindly - advise and explain the trade-offs. Sometimes
   complexity is intrinsic to the problem.
