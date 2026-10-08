/**
 * Accurate catenary / hanging rope curve mathematics.
 * Used identically by both the SVG rope renderer and card positioning.
 */
export function getRopePoint(
  x: number,
  viewportWidth: number,
  sag: number,
  ropeBaseY: number
): { y: number; slope: number; angleDeg: number } {
  const W = Math.max(viewportWidth, 600);
  const xMid = W / 2;

  // Normalized distance from horizontal center (-1 at left edge, 0 at center, +1 at right edge)
  // Scaling factor allows the rope to curve naturally across and slightly beyond the screen
  const span = W * 0.58;
  const u = (x - xMid) / span;

  // Smooth inverted bell / catenary approximation curve:
  // At u = 0 (center): factor = 1 -> y = ropeBaseY + sag (lowest point on screen)
  // At u = ±1: factor dips smoothly towards 0 -> y = ropeBaseY
  const factor = 1 / (1 + 1.25 * u * u);
  const y = ropeBaseY + sag * factor;

  // Derivative dy/dx:
  // d/du [ 1 / (1 + 1.25 u^2) ] = -2.5 * u / (1 + 1.25 u^2)^2
  // dy/dx = (dy/du) * (du/dx)
  const dFactorDu = (-2.5 * u) / Math.pow(1 + 1.25 * u * u, 2);
  const duDx = 1 / span;
  const dyDx = sag * dFactorDu * duDx;

  // Slope angle in radians and degrees:
  // When x < xMid (u < 0): dy/dx > 0 (slopes downwards to center). Card tilts clockwise.
  // When x > xMid (u > 0): dy/dx < 0 (slopes upwards to right edge). Card tilts counter-clockwise.
  const angleRad = Math.atan(dyDx);
  // Scale factor for natural card hanging physics (0.82 matches video's elegant tilt)
  const angleDeg = (angleRad * (180 / Math.PI)) * 0.82;

  return {
    y,
    slope: dyDx,
    angleDeg,
  };
}

/**
 * Generates an SVG path data string that exactly matches the rope curve formula.
 */
export function generateRopeSvgPath(
  viewportWidth: number,
  sag: number,
  ropeBaseY: number,
  padding: number = 150,
  steps: number = 80
): string {
  const W = Math.max(viewportWidth, 600);
  const startX = -padding;
  const endX = W + padding;
  const stepSize = (endX - startX) / steps;

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = startX + i * stepSize;
    const { y } = getRopePoint(x, W, sag, ropeBaseY);
    points.push([x, y]);
  }

  // Smooth SVG path using cubic Bezier or precision line segments
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)}`;
  }
  return d;
}
