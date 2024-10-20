import {TextToPhonemes} from './reciter.es6';
import {ToWords} from 'to-words';
import cmudict from 'cmudict';
const cmudict_val = cmudict();

/**
 * @param {Object} object
 * @param {string} key
 * @return {any} value
 */
function getParameterCaseInsensitive(object, key) {
  return object[Object.keys(object)
    .find(k => k.toLowerCase() === key.toLowerCase())
    ];
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/**
 * @param {string} words
 * @return {string}
 */
export function TextToPhonemesCMU(words) {
  // how to convert CMU stresses (main, secondary, none) to SAM stress http://www.retrobits.net/atari/sam.shtml#ch2.0
  const stresses = ["4", "", ""]
  let out = [];
  // split nicely
  let re = /([\w']+|[\d-.]+|[^\w\d\s]+)/g;
  [...words.matchAll(re)].forEach(word => {
    word = word[0].trim()
    // check cmudict
    let proc = getParameterCaseInsensitive(cmudict_val.dict, word);
    if (proc === undefined) {
      // if its a number
      if (isNumeric(word)) {
        // parse to words and try again
        const toWords = new ToWords();
        out.push(TextToPhonemesCMU(toWords.convert(parseFloat(word))))
      } else {
        // if not found, use classic mode/let sam guess
        let res = TextToPhonemes(word);
        if (typeof res === 'string') {
          out.push(res);
        }
      }
    } else {
      // if it is found
      out.push(proc
        // discrepancies between CMU and SAM
        .replace(/HH/gi, "/H")
        .replace(/JH/gi, "J")
        // replace whitespace
        .replace(/\s/ig, "")
        // convert stresses
        .replace(/0/g, stresses[2])
        .replace(/1/g, stresses[0])
        .replace(/2/g, stresses[1]));
    }
  });
  return (out.join(" "))
}
