import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;
let isRedisEnabled = false;

export const connectRedis = async (): Promise<void> => {
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
      console.warn('Upstash credentials not found. Redis disabled.');
      isRedisEnabled = false;
      return;
    }

    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });

    isRedisEnabled = true;
    console.log('Upstash Redis Connected');
  } catch (error) {
    console.error('Redis Connection Error:', error);
    isRedisEnabled = false;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient || !isRedisEnabled) {
    throw new Error('Redis client not initialized or disabled');
  }
  return redisClient;
};

export const cacheMiddleware = async (req: any, res: any, next: any) => {
  if (!isRedisEnabled || !redisClient) {
    return next();
  }
  try {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = await redisClient.get(key).catch((err) => {
      console.error('Redis Cache Get Error:', err);
      return null;
    });

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse as string));
    }

    res.sendResponse = res.json;
    res.json = (body: any) => {
      if (isRedisEnabled && redisClient) {
        redisClient.set(key, JSON.stringify(body), { ex: 3600 })
          .catch((err) => console.error('Redis Cache Set Error:', err));
      }
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    next();
  }
};

export default redisClient;
