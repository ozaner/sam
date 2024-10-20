# SAM - Software Automatic Mouth

## What is SAM?

[S.A.M. (Software Automatic Mouth)](https://en.wikipedia.org/wiki/Software_Automatic_Mouth)
is an old TTS (Text-To-Speech) program published in 1982 by Don't Ask Software
(now SoftVoice, Inc.).

For the official manual, refer to
[retrobits.net](http://www.retrobits.net/atari/sam.shtml).

## This Port

This repo houses a Javascript port of this software for the
[Deno runtime](https://deno.com/) based on the Commodore C64 version.

It was created as a fork of [this repo](https://github.com/discordier/sam) by
[discordier](https://github.com/discordier), with additional functionality taken
from [a different fork](https://github.com/reticivis-net/modern-sam) of the same
repo by [reticivis-net](https://github.com/reticivis-net).

## Usage
```js
//for the latest version
import SamJs from "https://raw.githubusercontent.com/ozaner/sam/refs/heads/master/src/index.js";

//for a specific HASH
// import SamJs from "https://raw.githubusercontent.com/ozaner/sam/<HASH>/src/index.js";

let text = "Hello world";

// Initialize new SamJS w/ default settings
let sam = new SamJs();

// Render the passed text as a buffer of PCM w/ samples of type u8
const buf8 = sam.pcmU8(text); //returns a Uint8Array

// Render the passed text as a buffer of PCM w/ samples of type f32
const buf32 = sam.buf32(text); //returns a Float32Array

// Render the passed text as a buffer containing a valid wav (uses u8 samples)
const wav = sam.wav(text); //returns a Uint8Array
```

### Typical voice values

| DESCRIPTION       | SPEED | PITCH | THROAT | MOUTH |
| ----------------- | ----- | ----- | ------ | ----- |
| Elf               | 72    | 64    | 110    | 160   |
| Little Robot      | 92    | 60    | 190    | 190   |
| Stuffy Guy        | 82    | 72    | 110    | 105   |
| Little Old Lady   | 82    | 32    | 145    | 145   |
| Extra-Terrestrial | 100   | 64    | 150    | 200   |
| SAM               | 72    | 64    | 128    | 128   |

## License

The software is a reverse-engineered version of a commercial software published
more than 30 years ago. The current copyright holder is
[SoftVoice, Inc.](https://www.text2speech.com/)

Any attempt to contact the company failed. The website was last updated in the
year 2009. The status of the original software can therefore best described as
[Abandonware](http://en.wikipedia.org/wiki/Abandonware).

As a result, and as with all other non-clean-room reverse-engineerings of this
software, this code probably can't be put under any specific open source
software license.

(But if you ask me, none of this really matters...)
