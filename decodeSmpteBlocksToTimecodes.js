const { decodeSmpteBlock } = require('./decodeSmpteBlock')

/**
 * decodeSmpteBlocksToTimecodes
 * Walk through an array of smpteBlocks which all contain the data about where they are, the bits contained and more.
 * This calls `decodeSmpteBlock` to read the userBits as well as the SMPTE timecode data and more.
 * Returns an array of all the smpteTimecodes with userBits, colorFrameFlag, and more.
 * The return value also includes the `block` information, which also includes the bits, position, sample position, and more.
 **/
function decodeSmpteBlocksToTimecodes(smpteBlocks) {
  return new Promise((resolve, reject) => {
    let smpteTimecodes = []
    for (let i = 0; i < smpteBlocks.length; i++) {
      const block = smpteBlocks[i]
      smpteBlockInformation = decodeSmpteBlock(block.bitsSmpte)
      smpteTimecodes.push({
        ...smpteBlockInformation,
        block,
      })
    }
    return resolve(smpteTimecodes)
  })
}

module.exports = {
  decodeSmpteBlocksToTimecodes
}