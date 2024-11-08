import { TextToPhonemes } from "./reciter/reciter.js";
import { TextToPhonemesCMU } from "./reciter/cmu-reciter.js";
import { SamBuffer, SamProcess } from "./sam.js";
import { ToWavBuffer } from "./util.js";

/**
 * @param {string} text
 * @return {string}
 */
function normalizeToASCII(text) {
  // Normalize the string to decompose combined letters and accents (NFD form)
  return text
    .normalize("NFD") // Decomposes combined characters
    .replace(/[\u0300-\u036f]/g, "") // Removes diacritic marks
    // deno-lint-ignore no-control-regex
    .replace(/[^\x00-\x7F]/g, ""); // Removes non-ASCII characters
}

const convert = (input, moderncmu = false) => {
  input = normalizeToASCII(input);
  if (moderncmu) {
    return TextToPhonemesCMU(input);
  } else {
    return TextToPhonemes(input);
  }
};

/**
 * @class SamJs
 */
class SamJs {
  /**
   * @param {object}  [options]
   * @param {Boolean} [options.phonetic]  Default false.
   * @param {Boolean} [options.singmode]  Default false.
   * @param {Boolean} [options.moderncmu] Default false.
   * @param {Boolean} [options.debug]     Default false.
   * @param {Number}  [options.pitch]     Default 64.
   * @param {Number}  [options.speed]     Default 72.
   * @param {Number}  [options.mouth]     Default 128.
   * @param {Number}  [options.throat]    Default 128.
   */
  constructor(options = {}) {
    this.opts = options;
  }

  /**
   * Ensure the input text is phonetic if not already.
   *
   * @param {string} text       The input text.
   * @param {boolean} phonetic  Flag indicating if the input is already phonetic.
   * @return {string}           The phonetic string or converted text.
   */
  ensurePhonetic(text, phonetic) {
    if (!(phonetic || this.opts.phonetic)) {
      return convert(text, this.opts.moderncmu);
    }
    return text.toUpperCase();
  }

  /**
   * Render the text as a PCM buffer using u8 samples.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Uint8Array}
   */
  pcmU8(text, phonetic) {
    return SamProcess(this.ensurePhonetic(text, phonetic), this.opts);
  }

  /**
   * Render the text as a PCM buffer using f32 samples.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Float32Array}
   */
  pcmF32(text, phonetic) {
    return SamBuffer(this.ensurePhonetic(text, phonetic), this.opts);
  }

  /**
   * Render the passed text as wave buffer array.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Uint8Array}
   */
  wav(text, phonetic) {
    return ToWavBuffer(this.pcmU8(text, phonetic));
  }
}

export default SamJs;
