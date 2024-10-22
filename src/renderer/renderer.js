import { PrepareFrames } from "./prepare-frames.js";
import { CreateOutputBuffer } from "./output-buffer.js";
import { ProcessFrames } from "./process-frames.js";
import { logger } from "../util.js";

/**
 * @param {Array} phonemes
 * @param {Number} [pitch]
 * @param {Number} [mouth]
 * @param {Number} [throat]
 * @param {Number} [speed]
 * @param {Boolean} [singmode]
 *
 * @return Uint8Array
 */
export const Renderer = (phonemes, pitch, mouth, throat, speed, singmode) => {
  pitch = (pitch === undefined) ? 64 : pitch & 0xFF;
  mouth = (mouth === undefined) ? 128 : mouth & 0xFF;
  throat = (throat === undefined) ? 128 : throat & 0xFF;
  speed = (speed || 72) & 0xFF;
  singmode = singmode || false;

  const sentences = PrepareFrames(phonemes, pitch, mouth, throat, singmode);

  // Reserve 176.4*speed samples (=8*speed ms) for each frame.
  const Output = CreateOutputBuffer(
    176.4 * // = (22050/125)
        phonemes.reduce((pre, v) => pre + v[1], 0) * // Combined phoneme length in frames.
        speed | 0,
  );

  const [t, frequency, pitches, amplitude, sampledConsonantFlag] = sentences;

  logger().debug(() => printOutput(pitches, frequency, amplitude, sampledConsonantFlag));

  ProcessFrames(
    Output,
    t,
    speed,
    frequency,
    pitches,
    amplitude,
    sampledConsonantFlag,
  );

  return Output.get();
};

const printOutput = (pitches, frequency, amplitude, sampledConsonantFlag) => {
  const pad = (num) => {
    const s = "00000" + num;
    return s.substr(s.length - 5);
  };

  // Initialize the output as a string
  let output = "===========================================\n";
  output += "Final data for speech output:\n";
  output += " flags ampl1 freq1 ampl2 freq2 ampl3 freq3 pitch\n";
  output += "------------------------------------------------\n";
  
  // Loop through the data and format it into the string
  for (let i = 0; i < sampledConsonantFlag.length; i++) {
    output += ` ${pad(sampledConsonantFlag[i])} ${pad(amplitude[0][i])} ${pad(frequency[0][i])} ${pad(amplitude[1][i])} ${pad(frequency[1][i])} ${pad(amplitude[2][i])} ${pad(frequency[2][i])} ${pad(pitches[i])}\n`;
  }

  // Add the closing line to the output
  output += "===========================================\n";

  // Return the final string instead of logging it
  return output;
};
