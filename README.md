# @alergeek-ventures/opencode

An [OpenCode](https://opencode.ai) plugin that provides AI-powered code review using Alergeek Ventures' coding guidelines.

## What it does

This plugin adds a `/av-review` command to OpenCode that reviews your code changes against a curated set of guidelines. It uses a multi-agent architecture:

- **Orchestrator agent** - Analyzes the scope of changes and delegates review tasks
- **File-level reviewer agents** - Check specific files against applicable guidelines

These subagents are hidden by default, meaning - you won't select them via `Tab`. Meaning, it won't clutter your setup, but requires you to use the command.

The review focuses on architectural concerns, following the guidelines we have across the company. What it does not focus on is syntax / style issues (which should be handled by linters and formatters).

## Installation

```bash
bunx @alergeek-ventures/opencode@latest init
```

This will:

1. Install the agent definitions to `~/.config/opencode/agent/`
2. Install the command to `~/.config/opencode/command/`
3. Prompt you to add the plugin to your OpenCode config

After running init, add the plugin to your `~/.config/opencode/config.json`:

```json
{
  "plugin": ["@alergeek-ventures/opencode"]
}
```

If you won't install the plugin, agents and command will work, but agent won't have access to the guidelines.

## Usage

In any git repository with OpenCode:

```
/av-review
```

I decied to prefix it to not collide with built-in `/review`.

The command reviews:

- Unstaged changes
- Difference from main branch
- Last commit (if on main)

## Guidelines

It's a distilled version of what we validate when working in [AV](https://alergeek.ventures). They were collected and modified from different places from the internet. Couple of examples of guidelines, to understand what is there:

| Guideline                       | Focus                           |
| ------------------------------- | ------------------------------- |
| `bulletproof-react`             | React patterns and architecture |
| `building-html-interfaces`      | HTML/UI best practices          |
| `colocation`                    | Keeping related code together   |
| `derived-state-vs-actual-state` | State management patterns       |
| `directory-structure`           | Project organization            |
| `focused-changes`               | Change scope and PR hygiene     |
| `reduce-cognitive-load`         | Code complexity and readability |
| `reducing-entropy`              | Fighting technical debt         |

You can go to `src/guidelines`. Guidelines are accessible via the `listGuidelines` and `readGuideline` tools exposed by the plugin. It's also possible to fork this repository, change the guidelines folder and put your own stuff there.

Possibly interesting things to test out:

- leverage [Vercel's React best practices](https://vercel.com/blog/introducing-react-best-practices)
- leverage [Callstack's React Native best practices](https://x.com/thymikee/status/2011508839900987508?s=20) (not yet released as of time of writing)

With Bun's macros - it should be super easy to swap these out. And with opencode subagents, it's easy to validate in parallel.

## How the Review Works

1. **Orient** - List changed files via `git diff --name-only origin/main`
2. **Delegate** - For larger changes, spawn file-level reviewer subagents
3. **Collect** - Gather findings, deduplicate, and produce a summary

## License

MIT
