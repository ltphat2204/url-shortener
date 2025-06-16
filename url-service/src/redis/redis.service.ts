import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  // Inject the Redis client using the custom token
  constructor(
    @Inject('REDIS_CLIENT') private readonly client: RedisClientType,
  ) {}

  // Gracefully close the connection when the application shuts down
  onModuleDestroy() {
    this.client.quit();
  }

  // A simple ping command to check the connection
  async ping() {
    return this.client.ping();
  }

  // Delete a key from Redis
  async del(key: string) {
    return this.client.del(key);
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
