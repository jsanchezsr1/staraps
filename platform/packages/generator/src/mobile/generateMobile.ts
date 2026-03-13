import { toPascalCase } from "../utils/naming";

function renderListScreen(model: any): string {
  const pascal = toPascalCase(model.name);
  return `import { View, Text } from "react-native";

export function ${pascal}ListScreen() {
  return (
    <View>
      <Text>${pascal} List Screen</Text>
    </View>
  );
}
`;
}

function renderDetailScreen(model: any): string {
  const pascal = toPascalCase(model.name);
  return `import { View, Text } from "react-native";

export function ${pascal}DetailScreen() {
  return (
    <View>
      <Text>${pascal} Detail Screen</Text>
    </View>
  );
}
`;
}

function renderAppTsx(spec: any): string {
  const imports = spec.models.map((model: any) => {
    const pascal = toPascalCase(model.name);
    return `import { ${pascal}ListScreen } from "./src/screens/${pascal}ListScreen";`;
  }).join("\n");

  const first = spec.models[0] ? `${toPascalCase(spec.models[0].name)}ListScreen` : null;

  return `import { View } from "react-native";
${imports}

export default function App() {
  return (
    <View>
      ${first ? `<${first} />` : "null"}
    </View>
  );
}
`;
}

export function generateMobile(spec: any) {
  const files = [
    {
      relativePath: "app/mobile/package.json",
      content: JSON.stringify({
        name: `${spec.meta.slug}-mobile`,
        private: true,
        scripts: { start: "expo start" },
        dependencies: { expo: "^51.0.0", react: "^18.3.1", "react-native": "^0.74.0" }
      }, null, 2),
      parser: "json"
    },
    {
      relativePath: "app/mobile/App.tsx",
      content: renderAppTsx(spec),
      parser: "typescript"
    }
  ];

  for (const model of spec.models) {
    const pascal = toPascalCase(model.name);
    files.push(
      { relativePath: `app/mobile/src/screens/${pascal}ListScreen.tsx`, content: renderListScreen(model), parser: "typescript" },
      { relativePath: `app/mobile/src/screens/${pascal}DetailScreen.tsx`, content: renderDetailScreen(model), parser: "typescript" }
    );
  }

  return files;
}
