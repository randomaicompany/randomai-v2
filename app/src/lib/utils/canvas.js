import * as R from "ramda";
export const createImageMap = R.pipe(
  R.defaultTo([]),
  R.pluck("src"),
  R.juxt([R.head, R.last]),
  R.zipObj(["front", "back"])
);

export const convertToStyles = (data) => {
  if (!Array.isArray(data) || !data.length) return "";

  return data
    .map(({ property, value }) => {
      if (!property || !value) return "";
      return `${property.toLowerCase()}:${value};`;
    })
    .filter(Boolean)
    .join(" ");
};

export const resizeCanvas = (canvas, containerNode) => {
  if (containerNode && canvas) {
    let scaleX;
    let scaleY;
    let currentWidth;
    let currentHeight;

    if (containerNode.clientWidth > 0) {
      currentWidth = containerNode.clientWidth;
      scaleX = currentWidth / canvas.width;
      canvas.setWidth(containerNode.clientWidth);
    }

    if (containerNode.clientHeight > 0) {
      currentHeight = containerNode.clientHeight;
      scaleY = currentHeight / canvas.height;
      canvas.setHeight(containerNode.clientHeight);
    }

    canvas.forEachObject((object) => {
      object.scaleX *= scaleX;
      object.scaleY *= scaleY;
      object.left *= scaleX;
      object.top *= scaleY;
      object.setCoords();
    });

    canvas.renderAll();
  }
};

export const exportCanvas = async (
  canvas,
  width = 768,
  isOutputDataURL = false
) => {
  const originalWidth = canvas.width;
  const desiredWidth = width;

  const scaleFactor = desiredWidth / originalWidth;
  const imageURL = canvas.toDataURL({
    quality: 1,
    format: "png",
    multiplier: scaleFactor
  });

  if (!isOutputDataURL) {
    return imageURL;
  }

  const res = await fetch(imageURL);
  const blob = res.blob();
  return blob;
};
