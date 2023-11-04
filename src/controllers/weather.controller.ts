import { Request, Response, NextFunction } from 'express';
import Weather from '../models/weather.model';

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { city } = req.query;
		const { lat, lon } = req.query;
		let weather;
		if (city) {
			weather = await Weather.upcoming(city as string);
		} else if (lat && lon) {
			weather = await Weather.upcoming(Number(lat), Number(lon));
		} else throw { status: 400, message: 'Invalid request.' };

		res.json({
			message: 'Weather retrieved successfully.',
			weather: weather
		});
	} catch (err) {
		res.locals.err = err;
		next();
	}
};
