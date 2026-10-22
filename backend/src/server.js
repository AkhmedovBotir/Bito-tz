import app from './app.js';
import { connectDB } from './shared/config/db.js';
import { env } from './shared/config/env.js';

async function bootstrap() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`API ishlayapti: http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Server ishga tushmadi:', err);
  process.exit(1);
});
