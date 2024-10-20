import {phonemeFlags} from './tables.js';

import { matchesBitmask } from '../util.js';

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
}
