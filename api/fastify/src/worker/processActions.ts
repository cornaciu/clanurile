import { Worker, Job } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const BASE = process.env.NOCODB_BASE || 'http://nocodb:8080';
const API_KEY = process.env.NOCODB_API_KEY || '';
const PROJECT = process.env.NOCODB_PROJECT || 'default';

// worker that processes jobs added by webhook
const worker = new Worker('action-queue', async (job: Job) => {
  const { actionId } = job.data as { actionId: string };
  console.log('Processing action', actionId);

  // fetch the action row from NocoDB
  const getUrl = `${BASE}/api/v1/db/data/${PROJECT}/action_queue/${actionId}`;
  const getRes = await fetch(getUrl, { headers: { 'xc-auth': API_KEY } });
  if (!getRes.ok) throw new Error(`Failed to fetch action ${actionId}`);
  const row = await getRes.json();

  // simulate work: wait and compute result
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000)); // simulate processing
  const success = Math.random() > 0.2; // 80% success
  const result = {
    success,
    reward: success ? Math.floor(Math.random() * 200) + 50 : 0,
    note: success ? 'Done' : 'Failed (guard check)'
  };

  // patch the row in NocoDB: update status + result
  const patchUrl = `${BASE}/api/v1/db/data/${PROJECT}/action_queue/${actionId}`;
  const patchRes = await fetch(patchUrl, {
    method: 'PATCH',
    headers: {
      'xc-auth': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: success ? 'done' : 'failed', result })
  });

  if (!patchRes.ok) {
    const txt = await patchRes.text();
    throw new Error('Failed to update action: ' + txt);
  }

  console.log('Action processed', actionId, result);
}, { connection: { url: redisUrl } });

worker.on('completed', (job) => console.log('job completed', job.id));
worker.on('failed', (job, err) => console.error('job failed', job?.id, err));
