import upscale from "./upscale";

export default async (orderData) => {
  if (!orderData || !Array.isArray(orderData.items)) {
    return {};
  }

  const upscaleFiles = async (files) =>
    Promise.all(
      files.map(async (file) => ({ ...file, url: await upscale(file.url) }))
    );

  const newItems = await Promise.all(
    orderData.items.map(async (item) => ({
      ...item,
      files: await upscaleFiles(item.files)
    }))
  );

  return { ...orderData, items: newItems };
};
