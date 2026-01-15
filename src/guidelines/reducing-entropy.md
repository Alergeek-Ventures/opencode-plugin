---
description: Fight complexity; leave the codebase better than you found it
---

# Reducing Entropy

## Philosophy

This codebase will outlive you. Every shortcut becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.
You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.
Fight entropy. Leave the codebase better than you found it.

## What is Entropy?

Entropy is a measure of how random a system is. In a different set of words,
more aligned with the way we are going to use it, rising entropy means rising
complexity - of the system, consisting of the code, services and data.

## The goal

Our goal in Alergeek Ventures is to reduce entropy as much as possible. Meaning
that new features should be added to the system with as little impact as
possible on the existing system. It's not possible to reduce entropy to zero,
but we can reduce it to a minimum.

It's very important to note, that our goal of reducing entropy should not
be going in the way of progressing the project. We want to keep on iterating
and improving the system, but try to keep the complexity low.

We should always keep in mind that higher entropy today might mean a lot lower
entropy tomorrow. New abstractions might help us to reduce the complexity
long-term. That's why we should weigh in the trade-offs.

## Instructions

When validating this guideline, we want you to understand the code that's being
added. Contrast it with the code that's already there - is it composing well?
Try to reason about the direction of the project - is this change aligned with
it?

There is rarely a clear right or wrong way of following this guideline. That's
why you should advise more than restrict or command. If you have access, look
at issues or a plan and try to surface any potential trade-offs developer
might've missed. Typically, there is a few ways to approach any problem,
ranging between entropy reduction and entropy increase - short term and long
term.

An example of it is consistent naming. Look at the code in the codebase and
see if similar patterns are similarly named. Try not to introduce new naming conventions
unless it's absolutely necessary.
