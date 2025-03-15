import { CacheDriver } from '../../src/drivers/repositories/cache-manager.driver.impl';
import { redisClient } from '../../src/drivers/database/redis.connect';
import Redis from 'ioredis';

jest.mock('../../src/drivers/database/redis.connect', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('CacheDriver', () => {
  let cacheDriver: CacheDriver;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    // Reset singleton instance
    (CacheDriver as any).instance = null;

    mockRedis = redisClient as jest.Mocked<Redis>;
    cacheDriver = CacheDriver.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed JSON data when exists', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await cacheDriver.get('test-key');

      expect(result).toEqual(mockData);
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheDriver.get('non-existent-key');

      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith('non-existent-key');
    });
  });

  describe('set', () => {
    it('should store data with default expiration', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      mockRedis.set.mockResolvedValue('OK');

      const result = await cacheDriver.set('test-key', mockData);

      expect(result).toBe('OK');
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(mockData), 'EX', 3600);
    });

    it('should store data with custom expiration', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      const customTTL = 7200;
      mockRedis.set.mockResolvedValue('OK');

      const result = await cacheDriver.set('test-key', mockData, customTTL);

      expect(result).toBe('OK');
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(mockData), 'EX', customTTL);
    });
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = CacheDriver.getInstance();
      const instance2 = CacheDriver.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
