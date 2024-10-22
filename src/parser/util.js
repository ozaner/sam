import { phonemeFlags, PhonemeNameTable } from "./tables.js";

import { matchesBitmask } from "../util.js";

/**
 * Test if a phoneme has the given flag.
 *
 * @param {Number} phoneme The phoneme to test.
 * @param {Number} flag    The flag to test (see constants.js)
 *
 * @return {boolean}
 */
export const phonemeHasFlag = (phoneme, flag) => {
  return matchesBitmask(phonemeFlags[phoneme], flag);
};

/**
 * Debug printing.
 *
 * @param {Array} phonemeindex
 * @param {Array} phonemeLength
 * @param {Array} stress
 *
 * @return {string} The formatted phoneme data.
 */
export const printPhonemes = (phonemeindex, phonemeLength, stress) => {
  const pad = (num) => {
    let s = "000" + num;
    return s.substr(s.length - 3);
  };

  let output = "==================================\n";
  output += "Internal Phoneme presentation:\n";
  output += " pos  idx  phoneme  length  stress\n";
  output += "----------------------------------\n";
  for (let i = 0; i < phonemeindex.length; i++) {
    const name = () => {
      if (phonemeindex[i] < 81) {
        return PhonemeNameTable[phonemeindex[i]];
      }
      return "??";
    };
    output += ` ${pad(i)}  ${pad(phonemeindex[i])}  ${name(phonemeindex[i])}       ${pad(phonemeLength[i])}     ${pad(stress[i])}\n`;
  }
  output += "==================================\n";
  return output;
};
