const _ = require('lodash')
const Timecode = require('smpte-timecode')

const { LTCSYNCWORD } = require('./constant')

/**
 * decodeSmpteBinary
 * Decode a block of SMPTE binary bits
 * Expects valid SMPTE bit block which is already verified that it has the sync word at the end.
 * `smpteBitBlock` has to be 80 characters long, consist of only `1` and `0`, and end with the LTCSYNCWORD (see `constant.js`)
 * Returns a object with information about the read data including:
 *  - SMPTE Timecode object (using `smpte-timecode`)
 *  - userBits
 *  - colorFrameFlag
 *  - dropFrameFlag
 **/
function decodeSmpteBlock(smpteBitBlock) {
  // remove the Sync Word for easier processing.
  const blockBits = _.dropRight(smpteBitBlock, LTCSYNCWORD.length)

  // Chunk the binary block into binary words of the length of 4 bits
  let blockWords = _.chunk(blockBits, 4)

  const dropFrameFlagBinary = blockBits[10]
  const dropFrameFlag = (dropFrameFlagBinary === 1) ? true : false

  const colorFrameFlagBinary = blockBits[11]
  const colorFrameFlag = (colorFrameFlagBinary === 1) ? true : false

  // true = external timecode source | false = time origin is arbitrary
  const binaryGroupFlag1Binary = blockBits[58]
  const binaryGroupFlag1 = (binaryGroupFlag1Binary === 1) ? true : false

  const frameUnitsBinary = blockWords[0].reverse()
  const frameUnitsString = frameUnitsBinary.join('')
  const frameUnits = parseInt(frameUnitsString, 2)

  const frameTensBinary = [blockBits[8], blockBits[9]].reverse()
  const frameTensString = frameTensBinary.join('')
  const frameTens = parseInt(frameTensString, 2)

  const secondsUnitsBinary = blockWords[4].reverse()
  const secondsUnitsString = secondsUnitsBinary.join('')
  const secondsUnits = parseInt(secondsUnitsString, 2)

  const secondsTensBinary = [blockBits[24], blockBits[25], blockBits[26]].reverse()
  const secondsTensString = secondsTensBinary.join('')
  const secondsTens = parseInt(secondsTensString, 2)

  const minutesUnitsBinary = blockWords[8].reverse()
  const minutesUnitsString = minutesUnitsBinary.join('')
  const minutesUnits = parseInt(minutesUnitsString, 2)

  const minutesTensBinary = [blockBits[40], blockBits[41], blockBits[42]].reverse()
  const minutesTensString = minutesTensBinary.join('')
  const minutesTens = parseInt(minutesTensString, 2)

  const hoursUnitsBinary = blockWords[12].reverse()
  const hoursUnitsString = hoursUnitsBinary.join('')
  const hoursUnits = parseInt(hoursUnitsString, 2)

  const hoursTensBinary = [blockBits[56], blockBits[57]].reverse()
  const hoursTensString = hoursTensBinary.join('')
  const hoursTens = parseInt(hoursTensString, 2)

  const userBitsField1Binary = blockWords[1]
  const userBitsField1String = userBitsField1Binary.join('')
  const userBitsField1 = parseInt(userBitsField1String, 2)

  const userBitsField2Binary = blockWords[3]
  const userBitsField2String = userBitsField2Binary.join('')
  const userBitsField2 = parseInt(userBitsField2String, 2)

  const userBitsField3Binary = blockWords[5]
  const userBitsField3String = userBitsField3Binary.join('')
  const userBitsField3 = parseInt(userBitsField3String, 2)

  const userBitsField4Binary = blockWords[7]
  const userBitsField4String = userBitsField4Binary.join('')
  const userBitsField4 = parseInt(userBitsField4String, 2)

  const userBitsField5Binary = blockWords[9]
  const userBitsField5String = userBitsField5Binary.join('')
  const userBitsField5 = parseInt(userBitsField5String, 2)

  const userBitsField6Binary = blockWords[11]
  const userBitsField6String = userBitsField6Binary.join('')
  const userBitsField6 = parseInt(userBitsField6String, 2)

  const userBitsField7Binary = blockWords[13]
  const userBitsField7String = userBitsField7Binary.join('')
  const userBitsField7 = parseInt(userBitsField7String, 2)

  const userBitsField8Binary = blockWords[15]
  const userBitsField8String = userBitsField8Binary.join('')
  const userBitsField8 = parseInt(userBitsField8String, 2)

  // When learning to understand the userBits, the year can be differentiated bythe year being `< 67` becuase that's when timecode was invented.
  // Everything that is lower than 67 in year number is `2000 + SMPTE.years` all others are `1900 + SMPTE.years`.
  // This obviously will fail to be true in the year 2067 🙈.


  // "HH:MM:SS:FF" (non-drop-frame) or "HH:MM:SS;FF" (drop-frame).
  const smpteTimecodeString = `${hoursTens}${hoursUnits}:${minutesTens}${minutesUnits}:${secondsTens}${secondsUnits}${(dropFrameFlag) ? ';' : ':'}${frameTens}${frameUnits}`

  // console.log('smpteTimecodeString: ', smpteTimecodeString)
  // console.log('colorFrameFlag: ', colorFrameFlag, ' ', colorFrameFlagBinary)

  const frameRate = undefined // TODO: learn how to read the frame rate from the binary code or other stuff?
  const t = Timecode(smpteTimecodeString, frameRate, dropFrameFlag)
  return {
    timecode: t,
    colorFrameFlag,
    dropFrameFlag,
    userBits: {
      userBit1: userBitsField1,
      userBit2: userBitsField2,
      userBit3: userBitsField3,
      userBit4: userBitsField4,
      userBit5: userBitsField5,
      userBit6: userBitsField6,
      userBit7: userBitsField7,
      userBit8: userBitsField8,
    },
    // TODO: include the userBits as processed date format as well…
  }
}

module.exports = {
  decodeSmpteBlock
}