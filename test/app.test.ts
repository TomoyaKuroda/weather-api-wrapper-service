import dotenv from 'dotenv';
import request from 'supertest';
import axios from 'axios';
import Redis from 'ioredis';
import app from '../src/app'; // Adjust the import path as needed

dotenv.config();

// Mock ioredis
jest.mock('ioredis', () => {
  const mRedis = {
    get: jest.fn(),
    set: jest.fn(),
  };
  return jest.fn(() => mRedis);
});

// Mock axios
jest.mock('axios');

const axiosMock = axios as jest.Mocked<typeof axios>;

describe('Weather API', () => {
  let redisInstance: jest.Mocked<Redis>;

  beforeEach(() => {
    redisInstance = new Redis() as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached weather data if available', async () => {
    const cityCode = '12345';
    const cachedData = { temp: 25 };
    redisInstance.get.mockResolvedValueOnce(JSON.stringify(cachedData));

    const response = await request(app).get(`/weather/${cityCode}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(cachedData);
    expect(redisInstance.get).toHaveBeenCalledWith(cityCode);
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('should fetch weather data from API if not in cache', async () => {
    const cityCode = '12345';
    const apiData = { temp: 30 };
    redisInstance.get.mockResolvedValueOnce(null);  // Simulate cache miss
    axiosMock.get.mockResolvedValueOnce({ data: apiData });

    const response = await request(app).get(`/weather/${cityCode}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(apiData);
    expect(redisInstance.get).toHaveBeenCalledWith(cityCode);
    expect(axiosMock.get).toHaveBeenCalled();
    expect(redisInstance.set).toHaveBeenCalled();
  });

  it('should return an error if the API call fails', async () => {
    const cityCode = '12345';
    redisInstance.get.mockResolvedValueOnce(null);  // Simulate cache miss
    axiosMock.get.mockRejectedValueOnce(new Error('API error'));

    const response = await request(app).get(`/weather/${cityCode}`);
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Unable to fetch weather data');
    expect(redisInstance.get).toHaveBeenCalledWith(cityCode);
    expect(axiosMock.get).toHaveBeenCalled();
  });
});