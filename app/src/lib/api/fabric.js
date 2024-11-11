import { asImageSrc } from "@prismicio/client";

export const removeBackground = async (imageURL) => {
  try {
    const response = await fetch("/cleanup", {
      method: "POST",
      body: JSON.stringify({
        imageURL,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert("Failed to remove background of image");
  }
};

// Image
export const removeAllImages = (canvas) => {
  canvas.getObjects().forEach((obj) => {
    if (obj.type === "image") {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

const getPositionAndScale = (canvas, image) => {
  const margin = 10;
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  let scaleX = 1;
  let scaleY = 1;

  if (image.width > canvasWidth - margin * 2 || image.height > canvasHeight - margin * 2) {
    const maxScaleX = (canvasWidth - margin * 2) / image.width;
    const maxScaleY = (canvasHeight - margin * 2) / image.height;
    const maxScale = Math.min(maxScaleX, maxScaleY);

    scaleX = maxScale;
    scaleY = maxScale;
  }

  const xCenter = canvasWidth / 2;
  const yCenter = canvasHeight / 2;

  return {
    scaleX,
    scaleY,
    left: xCenter - (image.width * scaleX) / 2,
    top: yCenter - (image.height * scaleY) / 2,
  };
};

export const bringToFront = (canvas) => {
  const activeObject = canvas.getActiveObject();

  if (activeObject) return;
  canvas.bringToFront(activeObject);
  canvas.renderAll();
};

export const addImageToCanvas = (canvas, imageRef, isPrismicImage) => (type) => {
  // removeAllImages(canvas);
  const src = isPrismicImage ? asImageSrc(imageRef) : imageRef;

  fabric.Image.fromURL(
    src,
    (image) => {
      const { scaleX, scaleY, top, left } = getPositionAndScale(canvas, image);

      const imgObject = image.set({
        top,
        left,
        scaleX,
        scaleY,
        hasBorders: true,
        hasControls: true,
      });

      if (type) {
        imgObject.objectType = type;
      }

      canvas.add(imgObject);
      canvas.setActiveObject(imgObject);

      return;
    },
    { crossOrigin: "anonymous" }
  );
};

export const addBase64ImageToCanvas = (canvas, imageBase64, type = "ai-generated-image") => {
  if (!imageBase64) return;
  const img = new Image();
  img.crossOrigin = "anonymous";

  removeAllImages(canvas);

  img.onload = () => {
    const { scaleX, scaleY, top, left } = getPositionAndScale(canvas, img);

    const imgObject = new fabric.Image(img, {
      top,
      left,
      scaleX,
      scaleY,
      hasBorders: true,
      hasControls: true,
    });

    imgObject.objectType = type;

    canvas.add(imgObject);
    canvas.renderAll();
  };

  img.src = imageBase64;
};

// Text
export const changeFont = (fontFamily, canvas) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.set("fontFamily", fontFamily);
    canvas.renderAll();
  }
};

export const changeFontFamily = (canvas, newFontFamily) => {
  const activeObject = canvas.getActiveObject();

  if (
    activeObject &&
    (activeObject.type === "text" ||
      activeObject.type === "i-text" ||
      activeObject.type === "textbox")
  ) {
    activeObject.set("fontFamily", newFontFamily);

    console.log(newFontFamily);
    canvas.requestRenderAll();
  } else {
    console.log("No text object selected or incorrect object type!");
  }
};

export const changeActiveColor = (canvas, color) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.set("fill", color);
    canvas.renderAll();
  }
};

export const addTextToCanvas = (canvas, data) => {
  const { textColor, textInput, fontFamily } = data;

  const text = new fabric.Text(textInput, {
    left: 0,
    top: 0,
    fontSize: 18,
    fontFamily,
    fill: textColor,
    hasBorders: true,
    hasControls: true, // Shows resize handles
  });

  canvas.add(text);
  canvas.setActiveObject(text);
};

// general

export const isCanvasEmpty = (canvas) => canvas.getObjects().length <= 0;

export const hasImageInCanvas = (canvas) => {
  const images = canvas.getObjects().filter((obj) => obj.type === "image");
  return !!images[0];
};

export const getImageInCanvas = (canvas) => {
  const activeObject = canvas.getActiveObject();
  return activeObject?.type === "image" ? activeObject.getSrc() : null;
};

export const clearAll = (canvas) => canvas.clear();
export const deleteItem = (canvas) => {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  canvas.remove(activeObject);
};

export const verticallyAlign = (canvas) => {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const canvasCenter = canvas.height / 2;
  const objectHeight = activeObject.height * activeObject.scaleY;

  activeObject.set("top", canvasCenter - objectHeight / 2).setCoords();
  canvas.renderAll();
};

export const horizontallyAlign = (canvas) => {
  const activeObject = canvas.getActiveObject();

  if (!activeObject) return;

  const canvasCenter = canvas.width / 2;
  const objectWidth = activeObject.width * activeObject.scaleX;

  activeObject.set("left", canvasCenter - objectWidth / 2).setCoords();

  canvas.renderAll();
};

export const deselectAll = (canvas) => canvas.discardActiveObject().renderAll();

const resizeCanvasContainer = (canvas, node) => {
  if (node && canvas) {
    let scaleX;
    let scaleY;
    let currentWidth;
    let currentHeight;

    if (node.clientWidth > 0) {
      currentWidth = node.clientWidth;
      scaleX = currentWidth / canvas.width;
      canvas.setWidth(node.clientWidth);
    }

    if (node.clientHeight > 0) {
      currentHeight = node.clientHeight;
      scaleY = currentHeight / canvas.height;
      canvas.setHeight(node.clientHeight);
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

export const replaceActiveImageSrc = (canvas, newSrc) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {
    fabric.Image.fromURL(
      newSrc,
      (newImage) => {
        const { scaleX, scaleY } = getPositionAndScale(canvas, newImage);
        activeObject.setElement(newImage.getElement());
        activeObject.set({
          scaleX,
          scaleY,
        });
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  }
};

export const resizeCanvas = (canvasRef, nodes) => {
  const { frontCanvasContainer, backCanvasContainer } = nodes;
  resizeCanvasContainer(canvasRef.front, frontCanvasContainer);
  resizeCanvasContainer(canvasRef.back, backCanvasContainer);
  return;
};

export const putBoundaryConstraints = (canvas) => {
  canvas.on("object:moving", (event) => {
    const { target: obj } = event;
    const top = 0;
    const left = 0;
    const width = canvas.width;
    const height = canvas.height;

    obj.top = Math.max(top, Math.min(obj.top, height - obj.height * obj.scaleY));
    obj.left = Math.max(left, Math.min(obj.left, width - obj.width * obj.scaleX));
  });

  canvas.on("object:scaling", (e) => {
    const obj = e.target;

    if (obj.left < 0) {
      obj.left = 0;
      obj.scaleX = obj.lastScaleX || obj.scaleX;
    }

    // Prevent scaling beyond the right edge
    if (obj.left + obj.width * obj.scaleX > canvas.width) {
      obj.scaleX = (canvas.width - obj.left) / obj.width;
    }

    // Prevent scaling beyond the top edge
    if (obj.top < 0) {
      obj.top = 0;
      obj.scaleY = obj.lastScaleY || obj.scaleY;
    }

    // Prevent scaling beyond the bottom edge
    if (obj.top + obj.height * obj.scaleY > canvas.height) {
      obj.scaleY = (canvas.height - obj.top) / obj.height;
    }

    obj.lastScaleX = obj.scaleX;
    obj.lastScaleY = obj.scaleY;
  });
};
