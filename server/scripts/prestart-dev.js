// Optional DB auto-start via Docker Compose; non-blocking when Docker is absent
const { spawnSync } = require('child_process');
const path = require('path');

try {
  const composeFile = path.resolve(__dirname, '../../docker-compose.yml');
  const result = spawnSync('docker', ['compose', '-f', composeFile, 'up', '-d', 'postgres'], {
    stdio: 'inherit',
    shell: true,
  });
  if (result.error) {
    console.warn('[prestart:dev] Docker not available, skipping DB auto-start.');
  } else if (result.status !== 0) {
    console.warn('[prestart:dev] Docker compose failed, skipping DB auto-start.');
  } else {
    console.log('[prestart:dev] Postgres started via Docker Compose.');
  }
} catch (e) {
  console.warn('[prestart:dev] Skipped DB auto-start:', e?.message || e);
}
process.exit(0);

