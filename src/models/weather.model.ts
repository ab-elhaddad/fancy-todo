/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { config } from '../configuration/config';

class Weather {
  /**
   * Get the upcoming weather for the next 5 days.
   * @param city The city to get the weather for.
   */
  static async upcoming(city: string): Promise<
    {
      main: number;
      description: string;
      temp: string;
      humidity: number;
      date: string;
    }[]
  >;
  /**
   * Get the upcoming weather for the next 5 days.
   * @param lat Latitude.
   * @param lon Longitude.
   */
  static async upcoming(
    lat: number,
    lon: number
  ): Promise<
    {
      main: number;
      description: string;
      temp: string;
      humidity: number;
      date: string;
    }[]
  >;

  static async upcoming(cityOrLat: string | number, lon?: number) {
    if (typeof cityOrLat === 'string' && lon === undefined)
      return this.upcomingWithCity(cityOrLat);
    else if (typeof cityOrLat === 'number' && typeof lon === 'number')
      return this.upcomingWithLatAndLon(cityOrLat, lon);
    else throw { status: 400, message: 'Invalid request.' };
  }

  static upcomingWithCity = async (city: string) => {
    const result = (
      await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?
					cnt=40&
					units=metric&
					q=${city}&
					appid=${config.weatherApiKey}`
      )
    ).data.list;
    const weather = this.filterWeatherData(result);
    return weather;
  };

  static upcomingWithLatAndLon = async (lat: number, lon: number) => {
    const result = (
      await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?
					cnt=40&
					units=metric&
					lat=${lat}&
					lon=${lon}&
					appid=${config.weatherApiKey}`
      )
    ).data.list;
    const weather = this.filterWeatherData(result);
    return weather;
  };

  /**
   * Filter the weather data to get only the data we need.
   */
  static filterWeatherData = (result: any[]) => {
    const weather = [];
    for (let i = 0; i < result.length; i += 7) {
      weather.push({
        main: result[i].weather[0].main,
        description: result[i].weather[0].description,
        temp: result[i].main.temp + ' C',
        humidity: result[i].main.humidity,
        date: result[i].dt_txt
      });
    }
    return weather;
  };
}

export default Weather;
