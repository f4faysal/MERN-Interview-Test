/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

import Swatch from "./Swatch";
import {
  adjustElementCoordinates,
  createElement,
  cursorForPosition,
  getElementAtPosition,
  midPointBtw,
  resizedCoordinates,
} from "./element";

// BlackBoard নামক একটি React ফাংশনাল কম্পোনেন্ট
function BlackBoard() {
  // বিভিন্ন স্টেট ভেরিয়েবল
  const [points, setPoints] = useState([]); // প্রতিটি পয়েন্টের তালিকা
  const [path, setPath] = useState([]); // পথের তালিকা
  const [isDrawing, setIsDrawing] = useState(false); // আপনার বর্তমান কি ধরনের আইটেম আপনি চেন্জ করতে চাচ্ছেন তা জানার জন্য এটি ব্যবহৃত হয়
  const [elements, setElements] = useState([]); // আপনার একক এলিমেন্টের তালিকা
  const [action, setAction] = useState("none"); // এটি নির্দেশ করে কোন ধরনের অ্যাকশান চলছে (যেমন: স্কেচ, মুভ, রিসাইজ, ইট্যারেশন)
  const [toolType, setToolType] = useState("pencil"); // বর্তমান চয়নকৃত শক্তি বা ইনস্ট্রুমেন্ট (পেন্সিল, ব্রাশ, ইরেসার, ইট্যারেশন)
  const [selectedElement, setSelectedElement] = useState(null); // বর্তমান চয়নকৃত এলিমেন্ট
  const [colorWidth, setColorWidth] = useState({
    // রঙ এবং পাথরের চওড়ার জন্য রঙ
    hex: "#fff",
    hsv: {},
    rgb: {},
  });
  const [width, setWidth] = useState(1); // পেন্সিল বা ব্রাশ ব্রাশের প্রস্থ বা ইটার প্রস্থ
  const [shapeWidth, setShapeWidth] = useState(1); // আইটেম এলিমেন্টের প্রস্থ (যেমন: রেক্ট্যাঙ্গুলার শেপ এর সর্কুলার)
  const [popped, setPopped] = useState(false); // এটি দেখায় যে একটি এলিমেন্ট বা পয়েন্ট মুছে ফেলা হয়েছে

  // কোড রেন্ডারিং এর জন্য useEffect
  useEffect(() => {
    // ক্যানভাস এলিমেন্টের ইনিশিয়েশন
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    /* 
  context.lineCap: এটি লাইনের শেষ (end) নির্দেশ করে। এটি তিনটি মান গ্রহণ করে:
  "butt": লাইনের শেষটি স্থানানুযায়ী সাধারিত (default) হয়।
  "round": লাইনের শেষটি একটি গোল বৃত্ত হয়।
  "square": লাইনের শেষটি একটি বর্গাকৃতি হয়। 
  */
    context.lineCap = "round";
    /* context.lineJoin: এটি যখন দুটি লাইন মিলাতে (join) হয় তখন এটি কোণের নির্দেশ করে। এটি তিনটি মান গ্রহণ করে:
"round": যখন দুটি লাইন মিলাতে হয়, সেখানে একটি গোল বৃত্ত তৈরি হয়।
"bevel": দুটি লাইনের মিলনে একটি সমতল মুক্তাঙ্গ তৈরি হয়।
"miter": এটি মুক্তাঙ্গ তৈরি হবে তখনই যখন context.miterLimit প্যারামিটারের  
*/
    context.lineJoin = "round";

    context.save();

    // এলিমেন্ট এবং পয়েন্টগুলি রেন্ডার করার জন্য ফাংশন
    const drawpath = () => {
      path.forEach((stroke, index) => {
        context.beginPath();

        stroke.forEach((point, i) => {
          context.strokeStyle = point.newColour;
          context.lineWidth = point.newLinewidth;

          var midPoint = midPointBtw(point.clientX, point.clientY);

          context.quadraticCurveTo(
            point.clientX,
            point.clientY,
            midPoint.x,
            midPoint.y
          );
          context.lineTo(point.clientX, point.clientY);
          context.stroke();
        });
        context.closePath();
        context.save();
      });
    };

    // ইরেসার টুল চলার সময় ক্যানভাস মুছে ফেলুন
    if (toolType === "eraser" && popped === true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setPopped(false);
    }

    // rough লাইব্রেরি ব্যবহার করে স্কেচ এলিমেন্ট রেন্ডার করুন
    const roughCanvas = rough.canvas(canvas);

    if (path !== undefined) drawpath();

    context.lineWidth = shapeWidth;

    // এলিমেন্টগুলি রেন্ডার করুন
    elements.forEach(({ roughElement }) => {
      context.globalAlpha = "1";
      context.strokeStyle = roughElement.options.stroke;
      roughCanvas.draw(roughElement);
    });

    // useEffect এর জন্য একটি রিটার্ন ফাংশন, ক্লীন আপের জন্য
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [popped, elements, path, width, toolType, shapeWidth]);

  // কোড রেন্ডারিং এর জন্য আরও একটি useEffect
  useEffect(() => {
    // localStorage থেকে path এবং elements লোড করুন
    const storedPath = localStorage.getItem("path");
    const storedElements = localStorage.getItem("elements");

    if (storedPath ) {
      setPath(JSON.parse(storedPath));
    }

    if (storedElements ) {
      setElements(JSON.parse(storedElements));
    }
  }, []); // মাউন্ট সময় একবারই চালানোর জন্য খালি ডিপেন্ডেন্সি অ্যারে

  // এলিমেন্ট আপডেট করার জন্য ফাংশন
  const updateElement = (
    index,
    x1,
    y1,
    x2,
    y2,
    toolType,
    strokeWidth,
    strokeColor
  ) => {
    const updatedElement = createElement(
      index,
      x1,
      y1,
      x2,
      y2,
      toolType,
      strokeWidth,
      strokeColor
    );
    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);

    // আপডেট করা এলিমেন্টগুলি localStorage তে সংরক্ষণ করুন
    localStorage.setItem("elements", JSON.stringify(elementsCopy));
  };

  // এলিমেন্ট বা পয়েন্ট মুছে ফেলতে দেখুন
  const checkPresent = (clientX, clientY) => {
    if (path === undefined) return;
    var newPath = path;
    path.forEach((stroke, index) => {
      stroke.forEach((point, i) => {
        if (
          clientY < point.clientY + 10 &&
          clientY > point.clientY - 10 &&
          clientX < point.clientX + 10 &&
          clientX > point.clientX - 10
        ) {
          newPath.splice(index, 1);
          setPopped(true);
          setPath(newPath);

          // আপডেট করা পথটি localStorage তে সংরক্ষণ করুন
          localStorage.setItem("path", JSON.stringify(newPath));

          return;
        }
      });
    });
    const newElements = elements;
    newElements.forEach((ele, index) => {
      if (
        clientX >= ele.x1 &&
        clientX <= ele.x2 &&
        clientY >= ele.y1 &&
        clientY <= ele.y2
      ) {
        newElements.splice(index, 1);
        setPopped(true);
        setElements(newElements);

        // আপডেট করা এলিমেন্টগুলি localStorage তে সংরক্ষণ করুন
        localStorage.setItem("elements", JSON.stringify(newElements));
      }
    });
  };

  // মাউস ডাউন ইভেন্ট
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (toolType === "selection") {
      // সিলেকশন টুল চলার সময় এলিমেন্ট চেক করুন
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resize");
        }
      }
    } else if (toolType === "eraser") {
      setAction("erasing");

      // ইরেসার টুলে মুছে ফেলা এলিমেন্ট বা পয়েন্ট চেক করুন
      checkPresent(clientX, clientY);
    } else {
      const id = elements.length;
      if (toolType === "pencil" || toolType === "brush") {
        setAction("sketching");
        setIsDrawing(true);

        // পেন্সিল বা ব্রাশ টুলের জন্য পয়েন্ট তৈরি করুন
        const newColour = colorWidth.hex;
        const newLinewidth = width;
        const transparency = toolType === "brush" ? "0.1" : "1.0";
        const newEle = {
          clientX,
          clientY,
          newColour,
          newLinewidth,
          transparency,
        };
        setPoints((state) => [...state, newEle]);

        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else {
        setAction("drawing");
        const newColour = colorWidth.hex;
        const newWidth = shapeWidth;
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          toolType,
          newWidth,
          newColour
        );

        setElements((prevState) => [...prevState, element]);
        setSelectedElement(element);

        // আপডেট করা এলিমেন্টগুলি localStorage তে সংরক্ষণ করুন
        localStorage.setItem(
          "elements",
          JSON.stringify([...elements, element])
        );
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const { clientX, clientY } = e;
    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (action === "erasing") {
      checkPresent(clientX, clientY);
    }
    if (action === "sketching") {
      if (!isDrawing) return;
      const colour = points[points.length - 1].newColour;
      const linewidth = points[points.length - 1].newLinewidth;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, colour, linewidth, transparency };

      setPoints((state) => [...state, newEle]);
      var midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      elements[index].strokeColor = colorWidth.hex;
      elements[index].strokeWidth = shapeWidth;
      updateElement(
        index,
        x1,
        y1,
        clientX,
        clientY,
        toolType,
        shapeWidth,
        colorWidth.hex
      );
    } else if (action === "moving") {
      const {
        id,
        x1,
        x2,
        y1,
        y2,
        type,
        offsetX,
        offsetY,
        shapeWidth,
        strokeColor,
      } = selectedElement;
      const offsetWidth = x2 - x1;
      const offsetHeight = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      updateElement(
        id,
        newX,
        newY,
        newX + offsetWidth,
        newY + offsetHeight,
        type,
        shapeWidth,
        strokeColor
      );
    } else if (action === "resize") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, shapeWidth, colorWidth.hex);
    }
  };

  const handleMouseUp = () => {
    if (action === "resize") {
      // যদি একটি এলিমেন্ট রিসাইজ হচ্ছে
      const index = selectedElement.id;
      const { id, type, strokeWidth, strokeColor } = elements[index];
      // প্রোগ্রাম স্টেট এর আপডেট এবং লোকাল স্টোরেজে এলিমেন্ট এর তথ্য সংরক্ষণ
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
    } else if (action === "drawing") {
      // যদি একটি শেপ বা ফ্রি-ড্রইং হচ্ছে
      const index = selectedElement.id;
      const { id, type, strokeWidth } = elements[index];
      // প্রোগ্রাম স্টেট এর আপডেট এবং লোকাল স্টোরেজে এলিমেন্ট এর তথ্য সংরক্ষণ
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);
    } else if (action === "sketching") {
      // যদি স্কেচিং হচ্ছে
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.closePath();

      // স্কেচিং এর জন্য পয়েন্টস ক্লিয়ার করা এবং স্কেচের পথ স্টেট এর আপডেট
      const element = points;
      setPoints([]);
      setPath((prevState) => [...prevState, element]); // টিউপল
      setIsDrawing(false);

      // স্কেচিং এর জন্য পথ স্টেট সংরক্ষণ করা হয়েছে
      localStorage.setItem("path", JSON.stringify([...path, element]));
    }

    // অবশ্যই এক্ষেত্রে 'action' স্টেট কে "none" এ সেট করা হয়েছে
    setAction("none");
  };

  return (
    <div>
      <Swatch
        toolType={toolType}
        setToolType={setToolType}
        width={width}
        setWidth={setWidth}
        setElements={setElements}
        setColorWidth={setColorWidth}
        setPath={setPath}
        colorWidth={colorWidth}
        setShapeWidth={setShapeWidth}
      />
      <canvas
        id="canvas"
        className="App"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => {
          var touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(e) => {
          var touch = e.touches[0];
          handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchEnd={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default BlackBoard;
