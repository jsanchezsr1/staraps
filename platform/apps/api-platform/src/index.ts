import { createApp } from "./app";
import { logger } from "@platform/shared";
import { parseEnv } from "@platform/shared/env";

const validatedEnv = parseEnv(process.env);
const app = createApp();
const port = Number(validatedEnv.PORT);

app.listen(port, () => {
  logger.info(`API platform running on http://localhost:${port}`);
});
