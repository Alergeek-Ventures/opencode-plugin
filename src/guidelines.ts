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

export async function getGuidelines(): Promise<Record<string, Guideline>> {
  const guidelineGlob = new Bun.Glob("./src/guidelines/*.md");

  const guidelines: Record<string, Guideline> = {};

  for await (const file of guidelineGlob.scan()) {
    const raw = await Bun.file(file).text();
    const { data, content } = parseFrontmatter(raw);
    const name = file.replace("./src/guidelines/", "").replace(".md", "");
    guidelines[name] = {
      description: data.description ?? "",
      content: content.trim(),
    };
  }

  return guidelines;
}

export async function getGuidelineNames() {
  return Object.keys(await getGuidelines());
}