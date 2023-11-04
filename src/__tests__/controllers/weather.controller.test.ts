import request from 'supertest';
import { app, server } from '../../index';
import Weather from '../../models/weather.model';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../models/weather.model');

// Mock authentication middleware
jest.mock('../../middlewares/authenticate.middleware.ts', () => (req: Request, res: Response, next: NextFunction) => {
	res.locals.user = { id: 1 };
	next();
});

describe('Weather Controller', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		server.close();
		jest.resetAllMocks();
	});
	describe('GET /weather', () => {
		it('should return the upcoming weather for a city', async () => {
			const city = 'New York';
			const weatherData = [
				{
					main: 'Clouds',
					description: 'overcast clouds',
					temp: '20 C',
					humidity: 50,
					date: '2022-01-01 12:00:00'
				},
				{
					main: 'Clear',
					description: 'clear sky',
					temp: '25 C',
					humidity: 40,
					date: '2022-01-02 12:00:00'
				},
				{
					main: 'Rain',
					description: 'light rain',
					temp: '18 C',
					humidity: 60,
					date: '2022-01-03 12:00:00'
				},
				{
					main: 'Thunderstorm',
					description: 'thunderstorm',
					temp: '22 C',
					humidity: 55,
					date: '2022-01-04 12:00:00'
				},
				{
					main: 'Snow',
					description: 'light snow',
					temp: '-2 C',
					humidity: 70,
					date: '2022-01-05 12:00:00'
				}
			];
			(Weather.upcoming as jest.Mock).mockResolvedValue(weatherData);

			const response = await request(app).get(`/weather?city=${city}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Weather retrieved successfully.');
			expect(response.body.weather).toEqual(weatherData);
		});

		it('should return the upcoming weather for a latitude and longitude', async () => {
			const lat = 40.7128;
			const lon = -74.006;
			const weatherData = [
				{
					main: 'Clouds',
					description: 'overcast clouds',
					temp: '20 C',
					humidity: 50,
					date: '2022-01-01 12:00:00'
				},
				{
					main: 'Clear',
					description: 'clear sky',
					temp: '25 C',
					humidity: 40,
					date: '2022-01-02 12:00:00'
				},
				{
					main: 'Rain',
					description: 'light rain',
					temp: '18 C',
					humidity: 60,
					date: '2022-01-03 12:00:00'
				},
				{
					main: 'Thunderstorm',
					description: 'thunderstorm',
					temp: '22 C',
					humidity: 55,
					date: '2022-01-04 12:00:00'
				},
				{
					main: 'Snow',
					description: 'light snow',
					temp: '-2 C',
					humidity: 70,
					date: '2022-01-05 12:00:00'
				}
			];
			(Weather.upcoming as jest.Mock).mockResolvedValue(weatherData);

			const response = await request(app).get(`/weather?lat=${lat}&lon=${lon}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Weather retrieved successfully.');
			expect(response.body.weather).toEqual(weatherData);
		});

		it('should return a 500 error if an error occurs', async () => {
			const city = 'New York';
			const errorMessage = 'An error occurred.';
			(Weather.upcoming as jest.Mock).mockRejectedValue({ message: errorMessage });

			const response = await request(app).get(`/weather?city=${city}`);

			expect(response.status).toBe(500);
			expect(response.body.message).toBe('An error occurred.');
		});
	});
});
