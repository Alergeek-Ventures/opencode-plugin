---
description: Challenge optimizations that sacrifice readability without evidence of need
---

# Premature optimization

We should never optimize prematurely - if it costs readability, maintainability,
or clutters the codebase.

## Goal

Run through the code and look for places where things were optimized. Anything
like for loops with special statements, useMemos in React codebases, any sort
of optimizations. Try to think of an unoptimized version. If it's a lot
simpler, then likely you want to challenge the assumptions. Ask the developer
for evidence.

## Why

A lot of optimizations are premature. They don't add value, but make the code
way more complicated - harder to read, maintain and change. Proper reasoning
makes it easier to make the right decisions in the future. Premature optimization
might mean that someone will carry it incurring more damage (e.g. way more time
spent on development) than necessary.
