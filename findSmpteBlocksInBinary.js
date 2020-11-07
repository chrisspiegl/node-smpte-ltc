const _ = require('lodash')
const { LTCSYNCWORD } = require('./constant')

/**
 * findSmpteBlocksInBinary
 * Receives a object with binaries and their smpte sample positions
 * Returns an array of blocks which are pre validated to be SMPTE conforming bit blocks.
 * This block contains the full string of bits found for the SMPTE block.
 * It also contains the whole bit block which may contain more than the 80 SMPTE block characters (to be able to verify discontinuity later).
 * Same goes for the `extraBits` count which also signifies that there are additional bits which are not valid SMPTE.
 * Additionally there is information like the index of where it happened in the bit array as well as where in the audio sample position.
 **/
async function findSmpteBlocksInBinary(binaries) {
  return new Promise((resolve, reject) => {
    let smpteBlocks = []
    const allBits = _.map(binaries, 'bit').join('')
    const splitBySyncWord = _.split(allBits, LTCSYNCWORD)
    let bitsUpToNow = ''
    for (let i = 0; i < splitBySyncWord.length; i++) {
      const smpteBitsBlockWithoutSyncWord = splitBySyncWord[i]
      const smpteBlockWithSyncWord = smpteBitsBlockWithoutSyncWord + LTCSYNCWORD
      if (smpteBitsBlockWithoutSyncWord.length < 80 - LTCSYNCWORD.length || i === splitBySyncWord.length - 1) {
        // blocks that are either too short (even though the are split by a sync word)
        // or it is the last block that may be incomplete…
        console.log(' ↯ Incomplete SMPTE bit Block - SKIPPING');
        const lastBlock = (i === splitBySyncWord.length - 1)
        const smpteBlock = (lastBlock) ? smpteBitsBlockWithoutSyncWord : smpteBlockWithSyncWord
        console.log(' ↯ Block:', smpteBlock, 'Length:', smpteBlock.length, 'Split #', i+1, 'how many Splits are there are:', splitBySyncWord.length);
        if (lastBlock) console.log(' ↯ This is the last block, so it is normal to be incomplete!')
        continue
      }

      const startBlock = bitsUpToNow.length
      bitsUpToNow += smpteBlockWithSyncWord
      const end = bitsUpToNow.length
      const startSmpteBlock = end - 80
      const extraBits = smpteBlockWithSyncWord.length - 80
      const smpteBlock = {
        extraBits,
        bitIndex: {
          start: startBlock,
          end,
        },
        bitIndexSmpte: {
          start: startSmpteBlock,
          end,
        },
        sampleSmpte: {
          start: binaries[end-80].sample.start,
          end: binaries[end].sample.end,
          size: binaries[end].sample.end - binaries[startSmpteBlock].sample.start,
        },
        bitsBlock: binaries.slice(startBlock, end),
        bitsBlockSmpte: binaries.slice(end - 80, end),
        bits: smpteBlockWithSyncWord,
        bitsSmpte: smpteBlockWithSyncWord.slice(extraBits, smpteBlockWithSyncWord.length),
      }
      smpteBlocks.push(smpteBlock)
      console.log('Valid Block:', smpteBlocks.length - 1, 'bits:', smpteBlock.bitsSmpte, 'has extra bits:', smpteBlock.extraBits);
    }
    return resolve(smpteBlocks)
  })
}

module.exports = {
  findSmpteBlocksInBinary
}