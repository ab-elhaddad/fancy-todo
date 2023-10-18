import insights from '../models/insights.model';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from '../configuration/config';

export const getTasksInsights = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: userID } = res.locals.user;
		const tasksInsights = await insights.getTasksInitiatedByMe(userID);
		res.json({ message: 'Tasks insights retrieved successfully.', insights: tasksInsights });
	} catch (err) {
		res.locals.error = err;
		next();
	}
};

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { city } = req.query;
		const { lat, lon } = req.query;
		let result;
		if (city) {
			result = (
				await axios.get(
					`https://api.openweathermap.org/data/2.5/forecast?
					cnt=40&
					units=metric&
					q=${city}&
					appid=${config.weatherApiKey}`
				)
			).data.list;
		} else if (lat && lon) {
			result = (
				await axios.get(
					`https://api.openweathermap.org/data/2.5/forecast?
					cnt=40&
					units=metric&
					lat=${lat}&
					lon=${lon}&
					appid=${config.weatherApiKey}`
				)
			).data.list;
		} else throw { status: 400, message: 'Invalid request.' };

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

		res.json({
			message: 'Weather retrieved successfully.',
			weather: weather
		});
	} catch (err) {
		res.locals.error = err;
		next();
	}
};
