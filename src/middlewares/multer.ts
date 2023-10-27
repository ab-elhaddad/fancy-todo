import multer from "multer";

export const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'attachments/');
	},
	filename: (_req, file, cb) => {
		//console.log(file);
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const storeAttatchment = multer({ storage: fileStorage }).single('attachment');

export default storeAttatchment;
