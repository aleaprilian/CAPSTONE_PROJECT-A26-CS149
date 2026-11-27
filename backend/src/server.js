import { createApp } from './app.js';
import { getEnvConfig } from './config/env.js';
import { createRepositoryFromEnv } from './repositories/index.js';

const config = getEnvConfig();
const repo = createRepositoryFromEnv(config);
const app = createApp(repo, { corsOrigins: config.corsOrigins });

app.listen(config.port, () => {
  console.log(
    `[RoyalStore Backend] berjalan di http://localhost:${config.port} (mode: ${repo.mode})`,
  );
});
