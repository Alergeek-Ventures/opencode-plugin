import { Plugin } from "@opencode/plugin";
import { getGuidelines, getGuidelineNames } from "./guidelines" with { type: 'macro'}

const guidelines = getGuidelines();
const guidelineNames = getGuidelineNames();


export const AlergeekPlugin = Plugin.define({
  id: "alergeek-ventures",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: "listGuidelines",
        description: "Lists all available guidelines",
        input: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () => ({
          content: guidelineNames
            .map((name) => `\`${name}\`: ${guidelines[name]?.description ?? "No description"}`)
            .join("\n"),
        }),
      });

      editor.add({
        name: "readGuideline",
        description: "Loads a guideline (a text file with instructions) from the guidelines directory",
        input: {
          type: "object",
          properties: {
            guideline: { type: "string", enum: guidelineNames },
          },
          required: ["guideline"],
          additionalProperties: false,
        },
        execute: async (input) => ({
          content: guidelines[(input as { guideline: string }).guideline]?.content ?? "Guideline not found",
        }),
      });
    });
  },
});

export default AlergeekPlugin;
