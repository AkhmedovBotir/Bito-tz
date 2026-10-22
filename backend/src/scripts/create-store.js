import readline from 'readline';
import { connectDB } from '../shared/config/db.js';
import { createStoreCli } from '../modules/auth/auth.service.js';

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  await connectDB();

  const fromArgs = {
    name: process.env.STORE_NAME || process.argv[2],
    phone: process.env.STORE_PHONE || process.argv[3],
    username: process.env.STORE_USERNAME || process.argv[4],
    password: process.env.STORE_PASSWORD || process.argv[5],
  };

  let payload = fromArgs;

  if (!payload.name || !payload.phone || !payload.username || !payload.password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log('Birinchi do‘konni yaratish\n');
    payload = {
      name: (await ask(rl, 'Do‘kon nomi: ')).trim(),
      phone: (await ask(rl, 'Telefon: ')).trim(),
      username: (await ask(rl, 'Username: ')).trim(),
      password: (await ask(rl, 'Parol: ')).trim(),
    };
    rl.close();
  }

  const result = await createStoreCli(payload);
  console.log('\nDo‘kon yaratildi:');
  console.log(JSON.stringify(result.store, null, 2));
  console.log('\nLogin: username + password bilan /api/auth/login');
  process.exit(0);
}

main().catch((err) => {
  console.error('Xato:', err.message || err);
  process.exit(1);
});
