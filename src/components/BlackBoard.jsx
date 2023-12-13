import { useState } from "react";

function BlackBoard() {
  
  const [path, setPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");


  const handleMouseDown = (e) => {
     const { clientX, clientY } = e;
     const canvas = document.getElementById("canvas");
     const context = canvas.getContext("2d");
 
     if (toolType === "selection") {
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
 
       checkPresent(clientX, clientY);
     } else {
       const id = elements.length;
       if (toolType === "pencil" || toolType === "brush") {
         setAction("sketching");
         setIsDrawing(true);
 
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
       }
     }
   };
 
 
  const handleMouseUp = () => {
     if (action === "resize") {
       const index = selectedElement.id;
       const { id, type, strokeWidth, strokeColor } = elements[index];
       const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
       updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
     } else if (action === "drawing") {
       const index = selectedElement.id;
       const { id, type, strokeWidth } = elements[index];
       const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
       updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);
     } else if (action === "sketching") {
       const canvas = document.getElementById("canvas");
       const context = canvas.getContext("2d");
       context.closePath();
       const element = points;
       setPoints([]);
       setPath((prevState) => [...prevState, element]); //tuple
       setIsDrawing(false);
     }
     setAction("none");
   };
 
  return (
    <div>
     
      <canvas
        
        onTouchStart={(e) => {
          var touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(e) => {
          var touch = e.touches[0];
          handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }}
      
      >
        Canvas
      </canvas>
    </div>
  );
}
export default BlackBoard;
