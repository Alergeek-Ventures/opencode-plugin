export async function getGuidelines() {
  const guidelineGlob = new Bun.Glob("./src/guidelines/*.md");

  const guidelines: Record<string, string> = {};

  for await (const file of guidelineGlob.scan()) {
    const content = await Bun.file(file).text();
    guidelines[file.replace("./src/guidelines/", "").replace(".md", "")] = content;
  }

  return guidelines;
}

export async function getGuidelineNames() {
  return Object.keys(await getGuidelines());
}