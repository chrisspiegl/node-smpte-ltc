# Node SMPTE LTC

![current status](https://img.shields.io/badge/current%20status-experimental-brightgreen?style=flat-square)

Read an Manchester-Biphase encoded audio signal and extract/decode it's SMPTE Timecode.

The goal is to have a node.js implementation of a SMPTE LTC decoder from audio files. Potentially also transcode on the fly to also analyze channels in video files.

## Status

Experimental / Basic Prototype / Getting to know the Topic

- Please participate and share ideas through the [Issues](./issues)

## Current Functionality

* Open WAV Audio File
* Reads a clean Manchester-Biphase encoded audio signal SMPT Timecode to a array of bits
* Splits the array of bits to SMPTE validated blocks (based on LTC Sync Word)
* Decodes those SMPTE Blocks to be actually Timecode data and log this to the console.

## What am I looking at

* Currently only successfully tested with `wav` files.
* Currently only analyses `mono` files on track `0` channel `0`.
* Currently only works with extremely clean LTC signal in PCM data.
* Currently only looks for positive to negative switches and their distance (ignores whether or not the data is in the right frequency)
* Currently does not work with "unclean" LTC signal (which is the reason I am coding this, see "What I'd like the code to do"

The code probably needs some optimizations as well as verifications. I am not really tracking the accuracy of the timecode at this point — since I am already pretty stoked that I am able to read the timecode to begin with 🙈.

With further iterations oft his library it may be possible to also achieve more and become increasingly resilient, accurate, and useful.

## Needs Testing / Improving

* `readSmpteBinariesFromPcmData.js` especially needs work to analyze if it correctly finds the binary values
	* needs to be tested with different Sample Rates (currently only tested with 48kHz)
	* This is also the file in which the logic for a more robust timecode analysis will happen (to be able to read and understand the "dirty" TC signal).

## What I'd like the code to do

* Understand clean and "dirty" signal (see sample files from Zoom F6 which have a different timecode format)
	* These are understood by commercial software but not by open source solutions at the moment.
	* May need to do this by tracking peaks but that's something I have not figured out at this point.
* Should work with multiple track/channel audio files and figure out which has SMPTE timecode and which does not.

## Future Ideas — End Goal

Within the topic of SMPTE LTC Data, more ideas for Tools / Libraries / Projects:

* Read timecode from all kinds of media files (mp4, mov, R3D, etc…) (extract the audio channels + potentially transcode and figure out if they have timecode data, if they do… store/display/output)
* Read meta data embedded timecode data from media files (to synchronize against)
* Implement a interface to display the media files on a synchronized timeline (maybe do so within [LTCsync](https://github.com/arikrupnik/ltcsync))
* Export timecode synced timeline to XML for import in Premiere Pro, Final Cut, etc.

## Resources

* Wikipedia [Linear Timecode](https://en.wikipedia.org/wiki/Linear_timecode)
* C Library [libltc](https://github.com/x42/libltc)
* [LTC-Tools](https://github.com/x42/ltc-tools) including ltcdump
* [LTCsync](https://github.com/arikrupnik/ltcsync) — Desktop Utility for Syncing Media Files based on Electron and Node.js