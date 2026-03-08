import test from "node:test";
import assert from "node:assert/strict";
import { allocatePreviewPort } from "../runtime/portAllocator";

test("preview port allocator returns deterministic port", async () => {
  const a = allocatePreviewPort("project:version");
  const b = allocatePreviewPort("project:version");
  assert.equal(a, b);
});
