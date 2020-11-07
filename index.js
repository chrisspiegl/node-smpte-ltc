const path = require('path')
const { readFileToAudioBuffer } = require('./readFileToAudioBuffer')
const { readSmpteBinariesFromPcmData } = require('./readSmpteBinariesFromPcmData')
const { findSmpteBlocksInBinary } = require('./findSmpteBlocksInBinary')
const { decodeSmpteBlocksToTimecodes } = require('./decodeSmpteBlocksToTimecodes')

const pathSoundFile = path.resolve("./samples/ltc-clean.wav")
// const pathSoundFile = path.resolve("./samples/7 - 32bit float - VXLR - LINE LEVEL.wav")

/**
 * main
 * Run through a test process.
 * 1. Reading an audio file into audioBuffer
 * 2. Try analysing the PCM for binary bits (Manchester-Biphase encoded audio signal)
 * 3. Find SMPTE Bit Blocks in the binary bits found in step 2
 * 4. Decode the SMPTE Bit Blocks and read Timecode information from them
 * 5. Print all found timecodes + information if there was Discontinuity
 * 6. Exit.
 **/
const main = async () => {
  console.log('Opening File and Reading the AudioBuffer');
  const audioBuffer = await readFileToAudioBuffer(pathSoundFile)
  logAudioBufferMetaData(audioBuffer) // log some info about the audio file to console
  console.log('Now the AudioBuffer is available to be processed');

  console.log('PCM Data analysis… Reading the Binary SMPTE code');
  const readBinaries = await readSmpteBinariesFromPcmData(audioBuffer.getChannelData(0), audioBuffer.sampleRate)
  console.log('Read', readBinaries.length, ' bits from the PCM Data');

  console.log('Searching for valid SMPTE Blocks');
  const smpteBlocks = await findSmpteBlocksInBinary(readBinaries)
  console.log('Found ', smpteBlocks.length, 'valid SMPTE blocks');

  console.log('Decoding SMPTE Binary Blocks to SMPTE Timecode Data');
  const smpteTimecodes = await decodeSmpteBlocksToTimecodes(smpteBlocks)
  console.log('Decoded ', smpteTimecodes.length, 'valid SMPTE blocks');

  console.log('Timecode\t|\tSample Size\t|\tSample Start\t|\tSample End') // print table legend
  smpteTimecodes.forEach((el) => {
    if (!!el.block.extraBits) {
      console.log(' ↯ Discontinuity - This Block has', el.block.extraBits, 'more bits than SMPTE blocks should have\n ↯', el.block.bits);
    }
    console.log(`${el.timecode}\t|\t${el.block.sampleSmpte.size}\t\t|\t${el.block.sampleSmpte.start}\t\t|\t${el.block.sampleSmpte.end}`)
  })
  console.log('Read ', smpteTimecodes.length, 'timecodes from this audio channel');
  console.log('Finished processign this file… exiting…');
}

/**
 * logAudioBufferMetaData
 * This logs a bunch of `audiobuffer` information to better understand the file that is being read.
 **/
function logAudioBufferMetaData(audioBuffer) {
  console.log('Audio Buffer Data:');
  console.log(' ↳ Channel Count:', audioBuffer.numberOfChannels)
  console.log(' ↳ Length:', audioBuffer.length)
  console.log(' ↳ Sample Rate:', audioBuffer.sampleRate)
  console.log(' ↳ Duration:', audioBuffer.duration, 'sec (read from AudioBuffer)')
  console.log(' ↳ Duration:', (audioBuffer.length / audioBuffer.sampleRate), 'sec (calculated via length/sampleRate)')
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    console.log(' ↳ Channel', i, 'has', audioBuffer.getChannelData(i).length, 'PCM Samples');
  }
}


/**
 * Run the `main` function.
 **/
main()