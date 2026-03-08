export async function formatCode(content: string): Promise<string> {
  return content;
}

export function indentBlock(content: string, spaces = 2): string {
  const pad = " ".repeat(spaces);
  return content
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}
