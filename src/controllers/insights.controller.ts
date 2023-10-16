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
			result = (await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?
					units=metric&
					q=${city}&
					appid=${config.weatherApiKey}`
			)).data;
		}
		else if (lat && lon) {
			result = (await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?
					units=metric&
					lat=${lat}&
					lon=${lon}&
					appid=${config.weatherApiKey}`
			)).data;
		}
		else
			throw { status: 400, message: 'Invalid request.' };

		res.json({
			message: 'Weather retrieved successfully.', weather: {
				main: result.weather[0].main,
				description: result.weather[0].description,
				temp: result.main.temp + ' C',
				humidity: result.main.humidity,
			}
		});
	} catch (err) {
		res.locals.error = err;
		next();
	}
}
