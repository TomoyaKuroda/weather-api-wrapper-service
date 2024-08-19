# Weather API with Redis Caching

This project is a simple weather API that fetches data from a third-party service (Visual Crossing) and implements caching using Redis. It's built with Node.js, Express, and ioredis.

## Features

- Fetch weather data for a given city code
- Cache weather data in Redis for 12 hours
- Use environment variables for configuration

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or higher recommended)
- Redis server running (local or remote)
- Visual Crossing API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/TomoyaKuroda/weather-api-wrapper-service.git
   cd weather-api-wrapper-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add the following:
   ```
   VISUAL_CROSSING_API_KEY=your_api_key_here
   REDIS_URL=your_redis_url_here
   PORT=3000
   ```
   Replace `your_api_key_here` with your Visual Crossing API key and `your_redis_url_here` with your Redis connection URL.

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The API will be available at `http://localhost:3000` (or the port you specified in the .env file).

3. To get weather data for a city, make a GET request to `/weather/:cityCode`, where `:cityCode` is the code for the city you want to query.

   Example:
   ```
   curl http://localhost:3000/weather/London
   ```

## API Endpoints

- `GET /weather/:cityCode`: Fetch weather data for the specified city code.

## Configuration

The application uses the following environment variables:

- `VISUAL_CROSSING_API_KEY`: Your Visual Crossing API key
- `REDIS_URL`: URL for your Redis instance
- `PORT`: The port on which the server will run (default: 3000)

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.