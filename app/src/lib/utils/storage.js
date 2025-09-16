export const uploadBase64ToServer = async (base64Data) => {
  const formdata = new FormData();
  formdata.append("base64", base64Data);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };

  const response = await fetch("/storage", requestOptions);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Upload failed");
  }
};

export const uploadBlobToGCS = async (blob) => {
  const uploadOptions = {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": "image/png"
    }
  };

  const signURLResponse = await fetch("/storage");
  const { signedUrl, fileName } = await signURLResponse.json();

  const response = await fetch(signedUrl, uploadOptions);

  if (response.ok) {
    console.log("Upload successful");

    return `https://storage.googleapis.com/randomai-storage/${fileName}`;
  } else {
    console.log("Upload failed");
  }
};
