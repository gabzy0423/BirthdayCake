import assert from "node:assert/strict";
// Run with Node.js 24 to load the TypeScript geometry helper without a test transpiler.
import test from "node:test";
import { ExtrudeGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from "three";
import { createCandleShape } from "../lib/cake-geometry.ts";

test("both candle digits produce finite, upright extruded geometry", () => {
  for (const digit of ["2", "0"]) {
    const geometry = new ExtrudeGeometry(createCandleShape(digit), { depth: 0.11, bevelEnabled: false });
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    assert.ok(bounds.min.y >= 0 && bounds.max.y < 1, "candle sits above the cake and below its wick");
    assert.ok(bounds.min.x < 0 && bounds.max.x > 0, "digit is centered around its candle position");
    for (const value of geometry.attributes.position.array) assert.ok(Number.isFinite(value));
    assert.ok(geometry.index || geometry.attributes.position.count > 0);
    geometry.dispose();
  }
});

test("zero keeps its hole open while its wax and the two's base stay solid", () => {
  for (const [digit, x, y, solid] of [["0", 0, 0.44, false], ["0", 0.22, 0.44, true], ["2", 0, 0.1, true]]) {
    const geometry = new ExtrudeGeometry(createCandleShape(digit), { depth: 0.11, bevelEnabled: false });
    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);
    const ray = new Raycaster(new Vector3(x, y, 1), new Vector3(0, 0, -1));
    assert.equal(ray.intersectObject(mesh).length > 0, solid);
    geometry.dispose();
    material.dispose();
  }
});
