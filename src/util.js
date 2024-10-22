import { getLogger } from "@std/log";

export function logger() {
  return getLogger("sam-js");
}

export const ANSI_RED = "\x1b[31m";
export const ANSI_RESET_COLOR = "\x1b[0m";

/**
 * Converts a Uint8Array buffer to a Uint8Array wave buffer
 *
 * @param {Uint8Array} audiobuffer
 *
 * @return {Uint8Array}
 */
export const ToWavBuffer = (audiobuffer) => {
  // Calculate buffer size.
  const realbuffer = new Uint8Array(
    4 + // "RIFF"
      4 + // uint32 filesize
      4 + // "WAVE"
      4 + // "fmt "
      4 + // uint32 fmt length
      2 + // uint16 fmt
      2 + // uint16 channels
      4 + // uint32 sample rate
      4 + // uint32 bytes per second
      2 + // uint16 block align
      2 + // uint16 bits per sample
      4 + // "data"
      4 + // uint32 chunk length
      audiobuffer.length,
  );

  let pos = 0;
  const write = (buffer) => {
    realbuffer.set(buffer, pos);
    pos += buffer.length;
  };

  //RIFF header
  write(text2Uint8Array("RIFF")); // chunkID
  write(Uint32ToUint8Array(audiobuffer.length + 12 + 16 + 8 - 8)); // ChunkSize
  write(text2Uint8Array("WAVE")); // riffType
  //format chunk
  write(text2Uint8Array("fmt "));
  write(Uint32ToUint8Array(16)); // ChunkSize
  write(Uint16ToUint8Array(1)); // wFormatTag - 1 = PCM
  write(Uint16ToUint8Array(1)); // channels
  write(Uint32ToUint8Array(22050)); // samplerate
  write(Uint32ToUint8Array(22050)); // bytes/second
  write(Uint16ToUint8Array(1)); // blockalign
  write(Uint16ToUint8Array(8)); // bits per sample
  //data chunk
  write(text2Uint8Array("data"));
  write(Uint32ToUint8Array(audiobuffer.length)); // buffer length
  write(audiobuffer);

  return realbuffer;
};

/**
 * Test if a bit is set.
 * @param {Number} bits The bits.
 * @param {Number} mask The mask to test.
 * @return {boolean}
 */
export const matchesBitmask = (bits, mask) => {
  return (bits & mask) !== 0;
};

export const text2Uint8Array = (text) => {
  const buffer = new Uint8Array(text.length);
  text.split("").forEach((e, index) => {
    buffer[index] = e.charCodeAt(0);
  });
  return buffer;
};

/**
 * @param {Uint8Array} buffer
 * @return {string}
 */
export const Uint8Array2Text = (buffer) => {
  let text = "";
  for (let i = 0; i < buffer.length; i++) {
    text += String.fromCharCode(buffer[i]);
  }

  return text;
};

export const Uint32ToUint8Array = (uint32) => {
  const result = new Uint8Array(4);
  result[0] = uint32;
  result[1] = uint32 >> 8;
  result[2] = uint32 >> 16;
  result[3] = uint32 >> 24;

  return result;
};

export const Uint16ToUint8Array = (uint16) => {
  const result = new Uint8Array(2);
  result[0] = uint16;
  result[1] = uint16 >> 8;

  return result;
};

/**
 * Convert a Uint8Array wave buffer to a Float32Array WaveBuffer
 *
 * @param {Uint8Array} buffer
 *
 * @return {Float32Array}
 */
export const Uint8ArrayToFloat32Array = (buffer) => {
  const audio = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    audio[i] = (buffer[i] - 128) / 256;
  }

  return audio;
};
