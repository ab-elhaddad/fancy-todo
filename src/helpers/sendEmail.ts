import transporter from '../lib/transporter';
import { config } from '../configuration/config';
import jwt from 'jsonwebtoken';

class sendEmail {
	/**
	 *  Sends an email with a confirmation link to the user to confirm his account.
	 * @param userID
	 * @param userEmail
	 */
	static async confirmation(userID: number, userEmail: string) {
		// Genertes a token based only on the id.
		const token = jwt.sign(String(userID), config.jwtSecretKey);
		const url = `${config.baseUrl}/confirm/${token}`;

		await transporter.sendMail({
			from: 'Fancy To-Do',
			to: userEmail,
			subject: 'Email confirmation',
			html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
		});
	}

	static async resetPassword(userID: number, userEmail: string) {
		const payload = {
			email: userEmail,
			id: userID
		};
		const token = jwt.sign(payload, config.jwtSecretKey, { expiresIn: '1h' });
		const url = `${config.baseUrl}/users/reset-password/${token}`;

		await transporter.sendMail({
			from: 'Fancy To-Do',
			to: userEmail,
			subject: 'Reset password',
			html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
		});
	}
}

export default sendEmail;
