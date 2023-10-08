/**
 *  @returns
 * - `startDate` [the date and time of the first millisecond of today]
 * - `endDate` [the date and the time of the last millisecond of today]
 */
const getDates = () => {
	const today = new Date();

	const startDate = new Date(today);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(today);
	endDate.setHours(23, 59, 59, 999);

	return { startDate, endDate };
};

export default getDates;
