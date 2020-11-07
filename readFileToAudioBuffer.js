const audioDecode = require('audio-decode')
const fs = require('fs')
const util = require("util")

const readFile = util.promisify(fs.readFile)

/**
 * readFileToAudioBuffer
 * Open a file based on it's file path.
 * Read it into a `fileBuffer` followed by decodig it into an `audioBuffer`.
 **/
async function readFileToAudioBuffer(pathSoundFile){
  console.log("readFileToAudioBuffer: ", pathSoundFile)
  const fileBuffer = await readFile(pathSoundFile)
  const audioBuffer = await audioDecode(fileBuffer)
  return audioBuffer
}

module.exports = {
  start: readFileToAudioBuffer,
  readFileToAudioBuffer: readFileToAudioBuffer,
}