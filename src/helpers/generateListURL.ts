import jwt from 'jsonwebtoken';
import { config } from './../configuration/config';

/**
 * Generates a URL to share a list with a token.
 * @returns URL to share a list.
 */
const shareList = (l_id: number): string => {
	const token = jwt.sign(String(l_id), config.jwtSecretKey);
	const url = `http://localhost:3000/lists/${token}`;
	return url;
};

export default shareList;
