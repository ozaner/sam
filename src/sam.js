import { Uint8ArrayToFloat32Array } from "./util.js";

import { Parser } from "./parser/parser.js";
import { Renderer } from "./renderer/renderer.js";

/**
 * Process the input and return the audio buffer.
 *
 * @param {String} input
 *
 * @param {object}  [options]
 * @param {Boolean} [options.singmode] Default false.
 * @param {Number}  [options.pitch]    Default 64.
 * @param {Number}  [options.speed]    Default 72.
 * @param {Number}  [options.mouth]    Default 128.
 * @param {Number}  [options.throat]   Default 128.
 *
 * @return {Float32Array|Boolean}
 */
export const SamBuffer = (input, options) => {
  return Uint8ArrayToFloat32Array(SamProcess(input, options));
};

/**
 * Process the input and return the audiobuffer.
 *
 * @param {String} input
 *
 * @param {object}  [options]
 * @param {Boolean} [options.singmode] Default false.
 * @param {Number}  [options.pitch]    Default 64.
 * @param {Number}  [options.speed]    Default 72.
 * @param {Number}  [options.mouth]    Default 128.
 * @param {Number}  [options.throat]   Default 128.
 *
 * @return {Uint8Array}
 */
export const SamProcess = (input, options = {}) => {
  const parsed = Parser(input);
  if (parsed === false) {
    return new Uint8Array(0);
  }

  return Renderer(
    parsed,
    options.pitch,
    options.mouth,
    options.throat,
    options.speed,
    options.singmode,
  );
};
