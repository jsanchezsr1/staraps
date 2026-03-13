export function parseGeneratedSpec(text: string): any {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("AI returned invalid JSON");
  }
}
