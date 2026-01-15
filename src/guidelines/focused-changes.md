# Focused changes

Changes in the codebase should be focused and well-defined. Optimally - one PR
is one change, through one commit. Of course this is not always possible, but
we should strive to make it a reality.

## Goal

Help detecting and minimizing straying away from the focus.

Some PRs can be research-like - where you explore a new idea,
new approach or a new pattern. Those will be a bit messier - from the scope to
the code. But then, they should be marked as drafts and shouldn't be reviewed
as religiously.

In such cases, inform the user about it and suggest how to split the PR. If PR
appears to be an R&D one, suggest switching it to draft. If it's a draft -
don't review it religiously.

## Why

This makes reviewing it easier - because you can read each line and the scope is
understandable. It also means that you can grasp the context quickly and act on
it. It also makes it easier to merge - and that's always what we want. Constant
rebasing is a waste of time and unmerged PRs are a waste of effort. It's best
to get things to the users so they can use it, give you feedback and for
creators to iterate and improve the feature.
