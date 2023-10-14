import getDates from '../../../helpers/getDates';
describe('getDates', () => {
	it('should return an object with startDate and endDate properties', () => {
		const { startDate, endDate } = getDates();
		expect(startDate).toBeDefined();
		expect(endDate).toBeDefined();
	});

	it(`should return startDate and endDate with today's date`, () => {
		const { startDate, endDate } = getDates();
		const today = new Date();
		expect(startDate.getFullYear()).toBe(today.getFullYear());
		expect(startDate.getMonth()).toBe(today.getMonth());
		expect(startDate.getDate()).toBe(today.getDate());
		expect(endDate.getFullYear()).toBe(today.getFullYear());
		expect(endDate.getMonth()).toBe(today.getMonth());
		expect(endDate.getDate()).toBe(today.getDate());
	});

	it('should set the time of startDate to 00:00:00.000', () => {
		const { startDate } = getDates();
		expect(startDate.getHours()).toBe(0);
		expect(startDate.getMinutes()).toBe(0);
		expect(startDate.getSeconds()).toBe(0);
		expect(startDate.getMilliseconds()).toBe(0);
	});

	it('should set the time of endDate to 23:59:59.999', () => {
		const { endDate } = getDates();
		expect(endDate.getHours()).toBe(23);
		expect(endDate.getMinutes()).toBe(59);
		expect(endDate.getSeconds()).toBe(59);
		expect(endDate.getMilliseconds()).toBe(999);
	});
});
