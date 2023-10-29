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

const storeAttachment = multer({ storage: fileStorage }).single('t_attachment');

export default storeAttachment;
