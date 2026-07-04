import { Redis } from '@upstash/redis';

let redisClient!: Redis;

export const connectRedis = async (): Promise<void> => {
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
      console.warn('Upstash credentials not found. Redis disabled.');
      return;
    }

    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });

    console.log('Upstash Redis Connected');
  } catch (error) {
    console.error('Redis Connection Error:', error);
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const cacheMiddleware = async (req: any, res: any, next: any) => {
  try {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = await getRedisClient().get(key);

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse as string));
    }

    res.sendResponse = res.json;
    res.json = (body: any) => {
      getRedisClient().set(key, JSON.stringify(body), { ex: 3600 });
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    next();
  }
};

export default redisClient;
