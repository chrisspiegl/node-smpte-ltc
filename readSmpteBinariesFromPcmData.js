/**
 * readSmpteBinariesFromPcmData
 * Expects an array of PCM values and sample rate.
 * NOTE: SampleRate is currently unused.
 * Detection of these Manchester-Biphase binary codes is done by lookign for simple switch from positive to negative value.
 * NOTE: currently limited to only understand very clean signal.
 * Returns an array of binary values including their Sample Position (start, end, smaple size)
 **/
async function readSmpteBinariesFromPcmData(pcmdata, samplerate) {
  return new Promise((resolve, reject) => {
    let previousDirectionSwitchSample = 0
    let previousDirection = 0
    let readBinaries = []

    for(let i = 0; i < pcmdata.length ; i++){

      // if (i > 100) break // TODO: just for debugging, only smaple the first second.
      // if (i > samplerate / 20) break // TODO: just for debugging, only smaple the first second.

      const currentDirection = (pcmdata[i] > 0) ? 1 : -1
      if (previousDirection !== currentDirection) {
        if ((i - previousDirectionSwitchSample) > 20) { // NOTE: using 20 hardcoded, probaly should make this based on something useful (sample rate?)
          // binary `0` is signified by a longer distance between the switches
          readBinaries.push({
            bit: 0,
            sample: {
              start: previousDirectionSwitchSample,
              end: i,
              size: i - previousDirectionSwitchSample,
            },
            value: pcmdata[i],
          })
        } else {
          if (previousDirection === 1) {
            // binary `1` is only signified when it's a short distance AND a switch from negative to positive values.
            readBinaries.push({
              bit: 1,
              sample: {
                start: previousDirectionSwitchSample,
                end: i,
                size: i - previousDirectionSwitchSample,
              },
              value: pcmdata[i],
            })
          }
        }
        previousDirectionSwitchSample = i
      }
      previousDirection = currentDirection

    }
    return resolve(readBinaries)
  })
}

module.exports = {
  readSmpteBinariesFromPcmData
}