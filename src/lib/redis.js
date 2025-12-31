// Using Upstash Redis REST API for serverless compatibility
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function redisFetch(command, ...args) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.result;
}

export async function redisExecute(commands) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
    body: JSON.stringify(commands),
  });
  const data = await response.json();
  return data.result;
}