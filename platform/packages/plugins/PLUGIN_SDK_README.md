# Plugin SDK

Milestone 3 Pack 5 adds the external plugin SDK scaffold.

## Plugin shape

A plugin exports:

- `manifest`
- optional `hooks`

Example:

```ts
import { definePlatformPlugin } from "@platform/plugins";

export default definePlatformPlugin({
  manifest: {
    key: "vendor.plugin",
    name: "Vendor Plugin",
    version: "1.0.0",
    type: "integration",
    description: "Example plugin"
  },
  hooks: {
    beforeGenerate(context) {
      console.log(context.projectId);
    }
  }
});
```

## Current scope
This is a loader/contract scaffold. Distribution, package signing, and remote registry
can be added in a later iteration.
