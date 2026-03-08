import { definePlatformPlugin } from "./sdk";

export const examplePlugin = definePlatformPlugin({
  manifest: {
    key: "example.hello-world",
    name: "Hello World Plugin",
    version: "1.0.0",
    type: "integration",
    description: "Example external plugin scaffold"
  },
  hooks: {
    beforeGenerate(context) {
      console.log("[example.hello-world] beforeGenerate", context.projectId);
    }
  }
});
