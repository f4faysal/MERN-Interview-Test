import { styles } from "../theme/styles";
import {
  Line,
  Resize
} from "../theme/svg";

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
        id="selection"
        data-toggle="tooltip"
        data-placement="top"
        title="Selection"
        style={styles.righticons}
        onClick={() => {
          setToolType("selection");
          setShapeWidth(1);
        }}
      >
        <Resize toolType={toolType} colorWidth={colorWidth} />
      </button>

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

     
    </div>
  );
}
