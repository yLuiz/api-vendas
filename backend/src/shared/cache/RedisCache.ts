import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@cofing/cache';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  // Save a cache
  public async save(key: string, value: any): Promise<void> {
    // Cache is saved like a string, so we need to convert the value given to a string even it is a string.
    await this.client.set(key, JSON.stringify(value));
  }

  // Get a cache that matches the given key
  public async recover<T>(key: string): Promise<T | null> {
    const cache = await this.client.get(key);

    if(!cache) return null;

    // Cache is returned as a string, so we need to convert to Object even it is a string.
    const paserdCache = JSON.parse(cache) as T;

    return paserdCache;
  }

  // Delete cache
  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }  
}