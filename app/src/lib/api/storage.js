import { Storage } from '@google-cloud/storage';
import { GCLOUD_STORAGE_CREDENTIALS } from '$env/static/private';

const storage = new Storage({
	projectId: 'even-ally-397218',
	credentials: JSON.parse(GCLOUD_STORAGE_CREDENTIALS)
});

const BUCKET_NAME = 'randomai-storage';

export const generateSignedUrl = async () => {
	const fileName = String(Date.now());

	const [signedUrl] = await storage
		.bucket(BUCKET_NAME)
		.file(fileName)
		.getSignedUrl({
			version: 'v4',
			action: 'write',
			contentType: 'image/png',
			expires: Date.now() + 15 * 60 * 1000
		});

	return {
		signedUrl,
		fileName
	};
};

export const uploadToGCS = async (buffer) => {
	try {
		const fileName = String(Date.now());
		const bucket = storage.bucket(BUCKET_NAME);
		const file = bucket.file(fileName);

		await file.save(Buffer.from(buffer));

		return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
	} catch (error) {
		return null;
	}
};
