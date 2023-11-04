import axios from 'axios';
import Weather from '../../models/weather.model';

jest.mock('axios');

describe('Weather', () => {
	const mockData = { list: [] } as { list: any[] }; // eslint-disable-line @typescript-eslint/no-explicit-any
	beforeAll(() => {
		const days = {
			list: [
				{
					weather: [{ main: 'Clouds', description: 'overcast clouds' }],
					main: { temp: 20, humidity: 50 },
					dt_txt: '2022-01-01 12:00:00'
				},
				{
					weather: [{ main: 'Clear', description: 'clear sky' }],
					main: { temp: 25, humidity: 40 },
					dt_txt: '2022-01-02 12:00:00'
				},
				{
					weather: [{ main: 'Rain', description: 'light rain' }],
					main: { temp: 18, humidity: 60 },
					dt_txt: '2022-01-03 12:00:00'
				},
				{
					weather: [{ main: 'Thunderstorm', description: 'thunderstorm' }],
					main: { temp: 22, humidity: 55 },
					dt_txt: '2022-01-04 12:00:00'
				},
				{
					weather: [{ main: 'Snow', description: 'light snow' }],
					main: { temp: -2, humidity: 70 },
					dt_txt: '2022-01-05 12:00:00'
				}
			]
		};
		days.list.forEach((day) => {
			for (let i = 0; i < 7; i++)
				mockData.list.push(day)
		});
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('upcoming', () => {
		it('should return the upcoming weather for a city', async () => {
			const city = 'New York';

			(axios.get as jest.Mock).mockResolvedValue({ data: mockData });

			const result = await Weather.upcoming(city);

			expect(result).toBeDefined();
			expect(result.length).toBe(5);
			expect(result[0]).toEqual({
				main: 'Clouds',
				description: 'overcast clouds',
				temp: '20 C',
				humidity: 50,
				date: '2022-01-01 12:00:00'
			});
			expect(result[1]).toEqual({
				main: 'Clear',
				description: 'clear sky',
				temp: '25 C',
				humidity: 40,
				date: '2022-01-02 12:00:00'
			});
			expect(result[2]).toEqual({
				main: 'Rain',
				description: 'light rain',
				temp: '18 C',
				humidity: 60,
				date: '2022-01-03 12:00:00'
			});
			expect(result[3]).toEqual({
				main: 'Thunderstorm',
				description: 'thunderstorm',
				temp: '22 C',
				humidity: 55,
				date: '2022-01-04 12:00:00'
			});
			expect(result[4]).toEqual({
				main: 'Snow',
				description: 'light snow',
				temp: '-2 C',
				humidity: 70,
				date: '2022-01-05 12:00:00'
			});
		});

		it('should return the upcoming weather for a latitude and longitude', async () => {
			const lat = 40.7128;
			const lon = -74.006;
			(axios.get as jest.Mock).mockResolvedValue({ data: mockData });

			const result = await Weather.upcoming(lat, lon);

			expect(result).toBeDefined();
			expect(result.length).toBe(5);
			expect(result[0]).toEqual({
				main: 'Clouds',
				description: 'overcast clouds',
				temp: '20 C',
				humidity: 50,
				date: '2022-01-01 12:00:00'
			});
			expect(result[1]).toEqual({
				main: 'Clear',
				description: 'clear sky',
				temp: '25 C',
				humidity: 40,
				date: '2022-01-02 12:00:00'
			});
			expect(result[2]).toEqual({
				main: 'Rain',
				description: 'light rain',
				temp: '18 C',
				humidity: 60,
				date: '2022-01-03 12:00:00'
			});
			expect(result[3]).toEqual({
				main: 'Thunderstorm',
				description: 'thunderstorm',
				temp: '22 C',
				humidity: 55,
				date: '2022-01-04 12:00:00'
			});
			expect(result[4]).toEqual({
				main: 'Snow',
				description: 'light snow',
				temp: '-2 C',
				humidity: 70,
				date: '2022-01-05 12:00:00'
			});
		});
	});

	describe('filterWeatherData', () => {
		it('should filter the weather data to get only the data we need', () => {

			const result = Weather.filterWeatherData(mockData.list);

			expect(result).toBeDefined();
			expect(result.length).toBe(5);
			expect(result[0]).toEqual({
				main: 'Clouds',
				description: 'overcast clouds',
				temp: '20 C',
				humidity: 50,
				date: '2022-01-01 12:00:00'
			});
			expect(result[1]).toEqual({
				main: 'Clear',
				description: 'clear sky',
				temp: '25 C',
				humidity: 40,
				date: '2022-01-02 12:00:00'
			});
			expect(result[2]).toEqual({
				main: 'Rain',
				description: 'light rain',
				temp: '18 C',
				humidity: 60,
				date: '2022-01-03 12:00:00'
			});
			expect(result[3]).toEqual({
				main: 'Thunderstorm',
				description: 'thunderstorm',
				temp: '22 C',
				humidity: 55,
				date: '2022-01-04 12:00:00'
			});
			expect(result[4]).toEqual({
				main: 'Snow',
				description: 'light snow',
				temp: '-2 C',
				humidity: 70,
				date: '2022-01-05 12:00:00'
			});
		});
	});
});
