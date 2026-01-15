import { type Plugin, tool } from "@opencode-ai/plugin";
import { getGuidelines, getGuidelineNames } from "./guidelines" with { type: 'macro'}

const guidelines = getGuidelines();
const guidelineNames = getGuidelineNames();


export const AlergeekPlugin: Plugin = async () => {
  return {
    tool: {
      listGuidelines: {
        description: "Lists all available guidelines",
        args: {},
        execute: async () => {
          return guidelineNames
            .map((name) => `\`${name}\`: ${guidelines[name]?.description ?? "No description"}`)
            .join("\n");
        },
      },
      readGuideline: {
        description: "Loads a guideline (a text file with instructions) from the guidelines directory",
        args: {
          guideline: tool.schema.enum(guidelineNames)
        },
        execute: async ({guideline}: {guideline: typeof guidelineNames[number]}) => {
          return guidelines[guideline]?.content ?? "Guideline not found";
        },
      }
    },
  };
};
