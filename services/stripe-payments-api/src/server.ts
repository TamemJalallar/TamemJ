import { appEnv } from './config/env.js';
import { logger } from './lib/logger.js';
import { FileStripePersistence } from './persistence/file-store.js';
import { createApp } from './app.js';

const persistence = new FileStripePersistence(appEnv.persistenceFilePath);
const app = createApp(persistence);

app.listen(appEnv.port, () => {
  logger.info(
    {
      port: appEnv.port,
      baseUrl: appEnv.baseUrl,
      mockMode: appEnv.mockMode,
      persistenceFilePath: appEnv.persistenceFilePath
    },
    'Stripe payments API listening.'
  );
});
