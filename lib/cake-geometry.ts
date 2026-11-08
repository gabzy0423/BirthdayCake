import { Path, Shape } from "three";

export function createCandleShape(digit: "2" | "0"): Shape {
  const shape = new Shape();

  if (digit === "0") {
    shape.absellipse(0, 0.44, 0.29, 0.43, 0, Math.PI * 2, false, 0);
    const hole = new Path();
    hole.absellipse(0, 0.44, 0.12, 0.26, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
  } else {
    shape.moveTo(-0.27, 0.63);
    shape.bezierCurveTo(-0.27, 0.93, 0.28, 0.94, 0.28, 0.65);
    shape.bezierCurveTo(0.28, 0.49, 0.12, 0.39, -0.08, 0.2);
    shape.lineTo(0.28, 0.2);
    shape.lineTo(0.28, 0.02);
    shape.lineTo(-0.27, 0.02);
    shape.lineTo(-0.27, 0.18);
    shape.bezierCurveTo(-0.23, 0.37, 0.08, 0.52, 0.08, 0.64);
    shape.bezierCurveTo(0.08, 0.77, -0.08, 0.77, -0.09, 0.63);
    shape.closePath();
  }

  return shape;
}
