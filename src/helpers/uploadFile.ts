import { upload } from "azure-blobv2";
import { config } from "../configuration/config";
import fs from "fs";

async function uploadFile(path: string, name?: string) {
	const result = await upload({
		accountName: config.storage.accountName,
		containerName: config.storage.containerName,
		filePath: path,
		fileName: name || Date.now().toString(),
		useConnectionString: true,
		connectionString: config.storage.connectionString,
	});
	if (!result.success)
		throw { message: result.message };

	fs.unlink(path, (err) => {
		if (err) console.error(err);
	});
	return result.data?.url;
}

export default uploadFile;
