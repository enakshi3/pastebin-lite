const { Redis } = require("@upstash/redis");

import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: 'https://apt-hare-5235.upstash.io',
  token: '********',
})

await redis.set("foo", "bar");
await redis.get("foo");

async function test() {
  await redis.set("hello", "world");
  const value = await redis.get("hello");
  console.log(value);
}

test();
