'use strict';

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movie {
  constructor(title, releaseDate) {
    this.title = title;
    this.releaseDate = releaseDate;
  }
}

// Define error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
}

// Register error handling middleware
app.use(errorHandler);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  console.log('Received request on /');
  res.send('Ahmed test!');
});

app.get('/weather', async (req, res) => {
  console.log('Received request on /weather');
  let { lat, lon, searchQuery } = req.query;

  console.log(`Query Parameters: lat=${lat}, lon=${lon}, searchQuery=${searchQuery}`);

  const weatherApiKey = process.env.WEATHER_API_KEY; // Access WEATHER_API_KEY from environment variable
  const weatherApiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherApiKey}`;

  try {
    const weatherResponse = await axios.get(weatherApiUrl);

    // console.log(weatherResponse);
    console.log("this is data:", weatherResponse.data);

    const forecasts = weatherResponse.data.data.map(day => {
      const date = day.datetime; // Assuming "datetime" is the field containing the date
      const description = day.weather.description; // Accessing nested object for description
      return { date, description }; // Return an object for each day with date and description
    });
    
    console.log(forecasts);
    
    res.json(forecasts); // Respond with the array of forecast objects
  } catch (weatherError) {
    console.error('Error fetching weather data:', weatherError.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/movies', async (req, res) => {
  console.log('Received request on /movies');
  let { city } = req.query;

  console.log(`Query Parameter: city=${city}`);

  const movieApiKey = process.env.MOVIE_API_KEY; // Access MOVIE_API_KEY from environment variable
  const movieApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${city}`;

  try {
    const movieResponse = await axios.get(movieApiUrl);

    if (movieResponse.data.results.length === 0) {
      res.status(404).json({ error: 'No movies found for the provided city' });
      return;
    }

    const movies = movieResponse.data.results.map(movie => {
      return {
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview,
        poster_path: movie.poster_path
      };
    });

    res.json(movies); // Respond with the array of movie objects
  } catch (movieError) {
    console.error('Error fetching movie data:', movieError.message);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
