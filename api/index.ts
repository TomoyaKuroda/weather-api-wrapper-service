import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import axios from 'axios';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Redis(process.env.REDIS_URL as string, {
  tls: {
    rejectUnauthorized: false
  }
});

app.get('/weather/:cityCode', async (req: Request, res: Response) => {
  const { cityCode } = req.params;

  try {
    // Check cache first
    const cachedData = await client.get(cityCode);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from API
    const response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode}`, {
      params: {
        unitGroup: 'metric',
        key: process.env.VISUAL_CROSSING_API_KEY,
      },
    });

    const weatherData = response.data;

    // Cache the result for 12 hours
    await client.set(cityCode, JSON.stringify(weatherData), 'EX', 43200);

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Weather API listening at http://localhost:${port}`);
  });
}

export default app;