import axios from "axios";
import fs from "fs";

export default async (url, filename) => {
  console.log("Downloading file");
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });

  fs.writeFileSync(filename, Buffer.from(response.data));

  console.log("Downloaded file", filename);
  return filename;

};
