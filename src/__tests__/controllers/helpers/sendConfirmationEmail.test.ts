import { config } from '../../../configuration/config';
import sendConfirmationEmail from '../../../helpers/sendConfirmationEmail';
import nodemailerMock from 'nodemailer';

// Mock the nodemailer createTransport function
jest.mock('nodemailer', () => ({
	createTransport: jest.fn().mockReturnValue({
		sendMail: jest.fn().mockResolvedValueOnce({})
	})
}));

afterAll(() => {
	// Restore the mock back to the original
	jest.restoreAllMocks();
});

describe('sendConfirmationEmail', () => {
	afterEach(() => {
		// Reset the mock to make sure the tests are isolated
		jest.clearAllMocks();
	});

	it('should send an email with a confirmation link', async () => {
		const userID = 123;
		const userEmail = 'test@example.com';

		// Call the function
		await sendConfirmationEmail(userID, userEmail);

		// Check that the createTransport function was called with the correct arguments
		expect(nodemailerMock.createTransport).toHaveBeenCalledWith({
			service: 'Gmail',
			port: 465,
			secure: true,
			auth: {
				user: config.gmailUser,
				pass: config.gmailPass
			}
		});

		// Check that the sendMail function was called with the correct arguments
		expect(nodemailerMock.createTransport().sendMail).toHaveBeenCalledWith({
			from: 'Fancy To-Do',
			to: userEmail,
			subject: 'Email confirmation',
			html: expect.stringContaining(`http://localhost:3000/confirm/`)
		});
	});
});
