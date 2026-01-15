import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Guideline {
  description: string;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = raw.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatter, content] = match;
  const data: Record<string, string> = {};
  
  if (frontmatter === undefined || content === undefined) {
    return { data: {}, content: raw };
  }
  
  for (const line of frontmatter.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      data[key] = value;
    }
  }

  return { data, content };
}

export function getGuidelines(): Record<string, Guideline> {
  const guidelinesDir = join(import.meta.dir, "guidelines");
  const guidelineGlob = new Bun.Glob("*.md");

  const guidelines: Record<string, Guideline> = {};

  for (const file of guidelineGlob.scanSync(guidelinesDir)) {
    const fullPath = join(guidelinesDir, file);
    const raw = readFileSync(fullPath, "utf8");
    const { data, content } = parseFrontmatter(raw);
    const name = file.replace(".md", "");
    guidelines[name] = {
      description: data.description ?? "",
      content: content.trim(),
    };
  }

  return guidelines;
}

export function getGuidelineNames() {
  return Object.keys(getGuidelines());
}