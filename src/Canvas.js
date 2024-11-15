import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

export default function CanvasComponent({ image }) {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [imageURL, setImageURL] = useState(image);

  useEffect(() => {
    // Initialize Fabric.js canvas
    fabricCanvas.current = new fabric.Canvas(canvasRef.current);

    if (imageURL) {
      fabric.Image.fromURL(imageURL, (img) => {
        img.set({
          crossOrigin: "anonymous", // This sets the CORS headers to be anonymous
        });
        img.scaleToWidth(canvasWidth);
        img.scaleToHeight(canvasHeight);
        fabricCanvas.current.setBackgroundImage(
          img,
          fabricCanvas.current.renderAll.bind(fabricCanvas.current),
          { scaleX: canvasWidth / img.width, scaleY: canvasHeight / img.height }
        );
      }, { crossOrigin: "anonymous" });
    }

    // Log canvas objects on initial render
    logCanvasObjects();

    // Clean up on unmount
    return () => {
      fabricCanvas.current.dispose();
    };
  }, [imageURL, canvasWidth, canvasHeight]);

  const logCanvasObjects = () => {
    // Get all objects on the canvas
    const objects = fabricCanvas.current.getObjects();
    
    // Log details of each object
    const objectDetails = objects.map((obj) => {
      if (obj.type === 'image') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
        };
      } else if (obj.type === 'textbox') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          text: obj.text,
          fontSize: obj.fontSize,
          fill: obj.fill,
        };
      } else if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          fill: obj.fill,
          width: obj.width,
          height: obj.height,
        };
      } else {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
        };
      }
    });

    console.log("Canvas Objects:", objectDetails);
  };

  const addText = () => {
    const text = new fabric.Textbox("Enter Caption Text", {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: "#FF0000",
      editable: true,
    });
    fabricCanvas.current.add(text);
    logCanvasObjects(); // Log the objects after adding new text
  };

  const addShape = (type) => {
    let shape;
    switch (type) {
      case "rectangle":
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          fill: "rgba(0, 0, 255, 0.5)",
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: 150,
          top: 150,
          radius: 50,
          fill: "rgba(255, 0, 0, 0.5)",
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: 200,
          top: 200,
          width: 100,
          height: 100,
          fill: "rgba(0, 255, 0, 0.5)",
        });
        break;
      default:
        break;
    }
    fabricCanvas.current.add(shape);
    logCanvasObjects(); // Log the objects after adding a new shape
  };

  const downloadImage = () => {
    try {
      const dataUrl = fabricCanvas.current.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "modified_image.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleAddTextClick = () => {
    const text = new fabric.Textbox('Enter Caption', {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: '#000', // Text color
      editable: true,
    });
    
    // Add the text and bring it to the front to ensure it's above shapes
    fabricCanvas.current.add(text);
    text.bringToFront();
    logCanvasObjects(); // Log the objects after adding new text
  };

  return (
    <div className="canvas-container" style={{ textAlign: "center" }}>
      <div className="canvas-toolbar">
        <button onClick={handleAddTextClick}>Add Text</button>
        <button onClick={() => addShape("rectangle")}>Add Rectangle</button>
        <button onClick={() => addShape("circle")}>Add Circle</button>
        <button onClick={() => addShape("triangle")}>Add Triangle</button>
        <button onClick={downloadImage}>Download</button>
      </div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}
