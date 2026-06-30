import { createClient, RedisClientType } from 'redis';

let redisClient!: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({
      url: redisUrl,
      socket: { reconnectStrategy: false },
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Connected'));

    await redisClient.connect();
  } catch (error) {
    console.error('Redis Connection Error:', error);
  }
};

export const getRedisClient = (): RedisClientType => {
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
      return res.json(JSON.parse(cachedResponse));
    }

    res.sendResponse = res.json;
    res.json = (body: any) => {
      getRedisClient().set(key, JSON.stringify(body), { EX: 3600 });
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    next();
  }
};

export default redisClient;
