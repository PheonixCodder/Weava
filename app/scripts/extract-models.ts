import fs from "fs";

const file = fs.readFileSync(
  "node_modules/@ai-sdk/google/dist/index.d.ts",
  "utf8"
);

const match = file.match(/type GoogleGenerativeAIModelId =([\s\S]*?);/);

const values = match![1]
  .split("|")
  .map((v) => v.replace(/["'|\s]/g, ""))
  .filter(Boolean);

fs.writeFileSync("./google-models.json", JSON.stringify(values, null, 2));
