import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { config } from '../configuration/config';

const transporter: Transporter = nodemailer.createTransport({
	service: 'Gmail',
	port: 465,
	secure: true,
	auth: {
		user: config.gmailUser,
		pass: config.gmailPass
	}
});

export default transporter;
