#!/usr/bin/env bun

import { Glob } from "bun";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

const PACKAGE_NAME = "@alergeek-ventures/opencode";

/**
 * Get the OpenCode config directory (cross-platform)
 * - Linux/macOS: ~/.config/opencode (respects XDG_CONFIG_HOME)
 * - Windows: %APPDATA%/opencode
 */
function getConfigDir(): string {
  if (process.platform === "win32") {
    const appData = Bun.env.APPDATA || join(homedir(), "AppData", "Roaming");
    return join(appData, "opencode");
  }
  const configHome = Bun.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(configHome, "opencode");
}

/**
 * Get the directory where this package is installed
 */
function getPackageDir(): string {
  return join(import.meta.dir, "..");
}

/**
 * Get list of markdown files in a directory
 */
async function getMarkdownFiles(dir: string): Promise<string[]> {
  const glob = new Glob("*.md");
  const files: string[] = [];
  for await (const file of glob.scan(dir)) {
    files.push(file);
  }
  return files;
}

/**
 * Check for file collisions and return list of conflicting files
 */
async function checkCollisions(sourceDir: string, targetDir: string): Promise<string[]> {
  const files = await getMarkdownFiles(sourceDir);
  const collisions: string[] = [];

  for (const file of files) {
    const targetPath = join(targetDir, file);
    if (await Bun.file(targetPath).exists()) {
      collisions.push(targetPath);
    }
  }

  return collisions;
}

/**
 * Copy markdown files from source to target directory
 */
async function copyFiles(sourceDir: string, targetDir: string): Promise<string[]> {
  const files = await getMarkdownFiles(sourceDir);

  await mkdir(targetDir, { recursive: true });

  for (const file of files) {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);
    await Bun.write(targetPath, Bun.file(sourcePath));
  }

  return files;
}

interface AssetGroup {
  name: string;
  sourceDir: string;
  targetDir: string;
}

/**
 * Install a group of assets (check collisions, copy files, log results)
 */
async function installAssets(
  group: AssetGroup,
  options: { overwrite?: boolean } = {}
): Promise<{ collisions: string[]; copied: string[] }> {
  const { overwrite = false } = options;
  const collisions = await checkCollisions(group.sourceDir, group.targetDir);
  if (collisions.length > 0 && !overwrite) {
    return { collisions, copied: [] };
  }

  const copied = await copyFiles(group.sourceDir, group.targetDir);
  console.log(`Installing ${group.name}...`);
  if (copied.length === 0) {
    console.log(`  (no ${group.name} to install)`);
  } else {
    for (const file of copied) {
      console.log(`  + ${file}`);
    }
  }

  return { collisions: [], copied };
}

async function prompt(message: string): Promise<boolean> {
  process.stdout.write(message);
  for await (const line of console) {
    const answer = line.trim().toLowerCase();
    return answer === "y" || answer === "yes";
  }
  return false;
}

async function checkGlobalPluginStatus(configDir: string): Promise<boolean> {
  const configPath = join(configDir, "config.json");
  const configFile = Bun.file(configPath);

  if (!(await configFile.exists())) {
    return false;
  }

  try {
    const config = await configFile.json();
    const plugins: unknown[] = config.plugin ?? [];
    return plugins.includes(PACKAGE_NAME);
  } catch {
    return false;
  }
}

interface InitOptions {
  overwrite?: boolean;
}

async function init(options: InitOptions = {}) {
  const { overwrite = false } = options;
  const packageDir = getPackageDir();
  const configDir = getConfigDir();

  const assetGroups: AssetGroup[] = [
    {
      name: "agents",
      sourceDir: join(packageDir, "agent"),
      targetDir: join(configDir, "agent"),
    },
    {
      name: "commands",
      sourceDir: join(packageDir, "command"),
      targetDir: join(configDir, "command"),
    },
  ];

  // Collect all files to be installed
  const filesToInstall: { group: string; file: string; targetPath: string }[] = [];
  for (const group of assetGroups) {
    const files = await getMarkdownFiles(group.sourceDir);
    for (const file of files) {
      filesToInstall.push({
        group: group.name,
        file,
        targetPath: join(group.targetDir, file),
      });
    }
  }

  // Check for collisions
  const collisions: string[] = [];
  for (const { targetPath } of filesToInstall) {
    if (await Bun.file(targetPath).exists()) {
      collisions.push(targetPath);
    }
  }

  // Check plugin status
  const pluginConfigured = await checkGlobalPluginStatus(configDir);

  // Show what will be installed
  console.log(`
AV Code Review Skill

This will install:
  - 2 subagents (code-review-orchestrator, file-level-code-reviewer)
  - 1 command (av-review)
  - Guidelines plugin (provides coding standards to agents)

Target: ${configDir}

Files to install:`);

  for (const { group, file } of filesToInstall) {
    console.log(`  ${group}/${file}`);
  }

  // Show plugin configuration status
  console.log(`
Plugin status:`);
  if (pluginConfigured) {
    console.log(`  Already configured in ${configDir}/config.json`);
  } else {
    console.log(`  Not configured - you'll need to add it after installation.`);
  }

  // Show collisions if any
  if (collisions.length > 0) {
    console.log(`
Warning: The following files already exist:`);
    for (const file of collisions) {
      console.log(`  - ${file}`);
    }
    if (overwrite) {
      console.log(`
These files will be overwritten.`);
    } else {
      console.log(`
To prevent data loss, installation will abort.
Remove or rename the conflicting files, or use --overwrite to replace them.
`);
      process.exit(1);
    }
  }

  // Ask for confirmation
  const confirmed = await prompt("\nProceed with installation? [y/N] ");
  if (!confirmed) {
    console.log("Installation cancelled.\n");
    process.exit(0);
  }

  console.log("");

  // Install all asset groups
  for (const group of assetGroups) {
    await installAssets(group, { overwrite });
  }

  // Final message with plugin instructions
  if (pluginConfigured) {
    console.log(`
Done! You can now use:

  /av-review
`);
  } else {
    console.log(`
Done! To enable guidelines, add the plugin to ${configDir}/config.json:

  {
    "plugin": ["${PACKAGE_NAME}"]
  }

Without the plugin, agents will work but won't have access to guidelines.

Once configured, you can use:

  /av-review
`);
  }
}

function showHelp() {
  console.log(`
${PACKAGE_NAME}

Usage:
  bunx ${PACKAGE_NAME} init              Install agents and commands to ~/.config/opencode/
  bunx ${PACKAGE_NAME} init --overwrite  Install and overwrite existing files
  bunx ${PACKAGE_NAME} --help            Show this help message

Options:
  --overwrite, -f  Overwrite existing files instead of aborting

The init command copies agent and command definitions to your OpenCode
config directory. If any files already exist, installation will abort
to prevent overwriting your customizations unless --overwrite is used.
`);
}

// Main
const args = Bun.argv.slice(2);
const overwrite = args.includes("--overwrite") || args.includes("-f");
const command = args.find((a) => !a.startsWith("-"));

switch (command) {
  case "init":
    await init({ overwrite });
    break;
  case undefined:
    if (!overwrite) {
      showHelp();
    } else {
      console.error(`No command specified.`);
      console.error(`Run 'bunx ${PACKAGE_NAME} --help' for usage.\n`);
      process.exit(1);
    }
    break;
  default:
    if (command === "--help" || command === "-h") {
      showHelp();
    } else {
      console.error(`Unknown command: ${command}`);
      console.error(`Run 'bunx ${PACKAGE_NAME} --help' for usage.\n`);
      process.exit(1);
    }
}
