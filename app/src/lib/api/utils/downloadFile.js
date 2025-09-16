import axios from 'axios';
import fs from 'fs';

export default async (url, filename) => {
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'arraybuffer'
	});

	fs.writeFileSync(filename, Buffer.from(response.data));

	return filename;
};
