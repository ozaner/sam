import {TextToPhonemes} from './reciter/reciter.es6';
import {TextToPhonemesCMU} from './reciter/cmu-reciter.es6';
import {SamProcess, SamBuffer} from './sam.es6';
import { ToWavBuffer } from './util.es6';

/**
 * @param {string} text
 * @return {string}
 */
function normalizeToASCII(text) {
  // Normalize the string to decompose combined letters and accents (NFD form)
  return text
    .normalize('NFD')                    // Decomposes combined characters
    .replace(/[\u0300-\u036f]/g, '')     // Removes diacritic marks
    .replace(/[^\x00-\x7F]/g, '');       // Removes non-ASCII characters
}

const convert = (input, moderncmu = false) => {
  input = normalizeToASCII(input)
  if (moderncmu) {
    return TextToPhonemesCMU(input);
  } else {
    return TextToPhonemes(input);
  }
}

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
   * Render the passed text as 8bit wave buffer array.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Uint8Array|Boolean}
   */
  buf8(text, phonetic) {
    return SamProcess(this.ensurePhonetic(text, phonetic), this.opts);
  }

  /**
   * Render the passed text as 32bit wave buffer array.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Float32Array|Boolean}
   */
  buf32(text, phonetic) {
    return SamBuffer(this.ensurePhonetic(text, phonetic), this.opts);
  }

  /**
   * Render the passed text as wave buffer array.
   *
   * @param {string}  text       The text to render or phoneme string.
   * @param {boolean} [phonetic] Flag if the input text is already phonetic data.
   * @return {Uint8Array|false}
   */
  wav(text, phonetic) {
    return ToWavBuffer(this.buf8(text, phonetic));
  }
}

export default SamJs;
