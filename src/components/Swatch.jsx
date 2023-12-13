/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */ 
import { styles } from "../theme/styles";
import {
  Download,
  Eraser,
  Line,
  Pencil,
  Rectangle,
  Reset
} from "../theme/svg";
import { download } from "./download";

export default function Swatch({
  toolType,
  setToolType,
  width,
  setWidth,
  setElements,
  setColorWidth,
  setPath,
  colorWidth,
  setShapeWidth,
}) {
  return (
    <div
      className="w-20 bg-black flex flex-col items-center justify-center  rounded-lg left-10 z-50"
      style={{
        position: "absolute",
        zIndex: 100,
        height: `${window.innerHeight * 0.09 * 8}px`,
        top: `${(window.innerHeight - window.innerHeight * 0.09 * 8) / 2}px`,
      }}
    >
  

      <button
        id="line"
        data-toggle="tooltip"
        data-placement="top"
        title="Line"
        style={styles.righticons}
        onClick={() => {
          setToolType("line");
          setWidth(1);
          setShapeWidth(1);
        }}
      >
        <Line toolType={toolType} colorWidth={colorWidth} />
      </button>

      <button
        id="rectangle"
        data-toggle="tooltip"
        data-placement="top"
        title="Rectangle"
        style={styles.righticons}
        onClick={() => {
          setToolType("rectangle");
          setWidth(1);
          setShapeWidth(1);
        }}
      >
        <Rectangle toolType={toolType} colorWidth={colorWidth} />
      </button>

      
      <button
        id="pencil"
        data-toggle="tooltip"
        data-placement="top"
        title="Pencil"
        style={styles.righticons}
        onClick={() => {
          setToolType("pencil");
          setWidth(1);
          setShapeWidth(1);
        }}
      >
        <Pencil toolType={toolType} colorWidth={colorWidth} />
      </button>

     

      <button
        id="eraser"
        data-toggle="tooltip"
        data-placement="top"
        title="Eraser"
        style={styles.righticons}
        onClick={() => {
          setToolType("eraser");
          setWidth(10);
          setShapeWidth(1);
        }}
      >
        <Eraser toolType={toolType} colorWidth={colorWidth} />
      </button>
      <button
        style={styles.righticons}
        data-toggle="tooltip"
        data-placement="top"
        title="Clear"
        onClick={() => {
          setElements([]);
          setPath([]);
          return;
        }}
      >
        <Reset />
      </button>

      <button
        style={styles.righticons}
        data-toggle="tooltip"
        data-placement="top"
        title="Download"
      >
        <a href="#" onClick={download}>
          <Download />
        </a>
      </button>
    </div>
  );
}
