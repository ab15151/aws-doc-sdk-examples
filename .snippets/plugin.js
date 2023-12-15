// INSTALLATION:
// mkdir node_modules ; ln -s /path/to/ailly/core node_modules/ailly

// USAGE:
// ailly --plugin file://./plugin.js [ailly arguments]
// Requirements: on or after the ailly refactor-12-12 branch

// DATA:
// Get the vector file from davidsouther via S3 presigned URL

const LANGUAGES = [
  "cpp",
  "dotnetv3",
  "gov2",
  "java2",
  "php",
  "rust",
  "python",
  "javascript.v3",
];

module.exports = async (engine, { root: path }) => {
  const { Ailly } = await import("ailly");
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");

  class MyRAG extends Ailly.RAG {
    constructor(engine, path) {
      super(engine, path);
    }

    async init() {
      if (!(await this.index.isIndexCreated())) {
        await this.index.createIndex();
      }
      await this.index.loadIndexData();
      this.index._data.items.forEach((item) => {
        if (Array.isArray(item.vector)) return;
        const vector = Buffer.from(item.vector, "base64");
        if (vector.length === 1536 * 4) item.vector = vector;
      });
      return this;
    }

    /*
    1. Get best three of every other language
    2. Take the best 5, with at least three languages included
    */
    async augment(content) {
      const vector = await this.engine.vector(content.prompt, {});
      const map = (
        await Promise.all(
          LANGUAGES.map(async (language) =>
            (
              await this.index.queryItems(vector, 3, { language })
            ).map(({ score, item }) => ({
              score,
              path: item.metadata.path,
              name: item.metadata.name,
              language,
            }))
          )
        )
      ).flat();

      map.sort((a, b) => b.score - a.score);
      const tmpResult = map.slice(0, 5);

      const results = tmpResult.map(async ({ score, name, language }) => ({
        score,
        name,
        language,
        content: await readFile(join(".vectors", name), { encoding: "utf8" }),
      }));

      content.augment = await Promise.all(results);
    }
  }

  return new MyRAG(engine, path + ".vectors").init();
};

async function cli() {
  const { Ailly } = await import("ailly");
  const engine = await Ailly.getEngine("openai");
  const plugin = await module.exports(engine, { root: "./" });
  const content = {
    path: "./test.txt",
    name: "test.txt",
    prompt: "Create an example using cloudwatch logs that includes pagination.",
  };
  await plugin.augment(content);
  console.log(content.prompt);
  console.table(
    content.augment.map(({ score, language, name }) => ({
      score,
      language,
      name,
    }))
  );
}

if (require.main === module) {
  cli().then(() => {});
}
