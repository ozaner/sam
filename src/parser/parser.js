import { logger } from "../util.js";
import { PhonemeNameTable } from "./tables.js";
import { Parser1 } from "./parse1.js";
import { Parser2 } from "./parse2.js";
import { AdjustLengths } from "./adjust-lengths.js";
import { CopyStress } from "./copy-stress.js";
import { SetPhonemeLength } from "./set-phoneme-length.js";
import { ProlongPlosiveStopConsonantsCode41240 } from "./prolong-plosive-stop-consonants.js";
import { printPhonemes } from "./util.js";

/**
 * Parses speech data.
 *
 * Returns array of [phoneme, length, stress]
 *
 * @param {string} input
 *
 * @return {Array|false} The parsed data.
 */
export const Parser = (input) => {
  if (!input) {
    return false;
  }
  const getPhoneme = (pos) => {
    if (pos < 0 || pos > phonemeindex.length) {
      logger().error(`Out of bounds: ${pos}`);
    }
    return (pos === phonemeindex.length) ? null : phonemeindex[pos];
  };
  const setPhoneme = (pos, value) => {
    logger().debug(
      `${pos} CHANGE: ${PhonemeNameTable[phonemeindex[pos]]} -> ${
        PhonemeNameTable[value]
      }`,
    );
    phonemeindex[pos] = value;
  };

  /**
   * @param {Number} pos         The position in the phoneme array to insert at.
   * @param {Number} value       The phoneme to insert.
   * @param {Number} stressValue The stress.
   * @param {Number} [length]    The (optional) phoneme length, if not given, length will be 0.
   *
   * @return {undefined}
   */
  const insertPhoneme = (pos, value, stressValue, length) => {
    logger().debug(() => `${pos} INSERT: ${PhonemeNameTable[value]}`);
    for (let i = phonemeindex.length - 1; i >= pos; i--) {
      phonemeindex[i + 1] = phonemeindex[i];
      phonemeLength[i + 1] = getLength(i);
      stress[i + 1] = getStress(i);
    }
    phonemeindex[pos] = value;
    phonemeLength[pos] = length | 0;
    stress[pos] = stressValue;
  };
  const getStress = (pos) => stress[pos] | 0;
  const setStress = (pos, stressValue) => {
    logger().debug(() =>
      `${pos} "${PhonemeNameTable[phonemeindex[pos]]}" SET STRESS: ${
        stress[pos]
      } -> ${stressValue}`
    );
    stress[pos] = stressValue;
  };
  const getLength = (pos) => phonemeLength[pos] | 0;
  const setLength = (pos, length) => {
    logger().debug(() =>
      `${pos} "${PhonemeNameTable[phonemeindex[pos]]}" SET LENGTH: ${
        phonemeLength[pos]
      } -> ${length}`
    );
    if ((length & 128) !== 0) {
      throw new Error(
        "Got the flag 0x80, see CopyStress() and SetPhonemeLength() comments!",
      );
    }
    if (pos < 0 || pos > phonemeindex.length) {
      throw new Error("Out of bounds: " + pos);
    }
    phonemeLength[pos] = length;
  };

  const stress = []; //numbers from 0 to 8
  const phonemeLength = [];
  const phonemeindex = [];

  let pos = 0;
  Parser1(
    input,
    (value) => {
      stress[pos] = 0;
      phonemeLength[pos] = 0;
      phonemeindex[pos++] = value;
    },
    (value) => {
      logger().debug(() => {
        if ((value & 128) !== 0) {
          throw new Error(
            "Got the flag 0x80, see CopyStress() and SetPhonemeLength() comments!",
          );
        }
        return `Setting stress for prior phoneme: ${value}`;
      });
      stress[pos - 1] = value; /* Set stress for prior phoneme */
    },
  );

  logger().debug(() => printPhonemes(phonemeindex, phonemeLength, stress));

  Parser2(insertPhoneme, setPhoneme, getPhoneme, getStress);
  CopyStress(getPhoneme, getStress, setStress);
  SetPhonemeLength(getPhoneme, getStress, setLength);
  AdjustLengths(getPhoneme, setLength, getLength);
  ProlongPlosiveStopConsonantsCode41240(getPhoneme, insertPhoneme, getStress);

  logger().debug(() => printPhonemes(phonemeindex, phonemeLength, stress));

  return phonemeindex.map((v, i) =>
    v ? [v, phonemeLength[i] | 0, stress[i] | 0] : null
  )
    .filter((v) => v);
};
