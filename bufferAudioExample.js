// newRegion variable declaration.
let newRegion = {};

// Helpers
function setUint16(view, pos, data) {
    view.setUint16(pos, data, true);
    pos += 2;
}

function setUint32(view, pos, data) {
    view.setUint32(pos, data, true);
    pos += 4;
}

// buffer2wav function definition. Converts an audio buffer segment to a blob using wav
function buffer2wav(abuffer, offset,len){
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        pos = 0;

    // write WAVE header
    setUint32(view, pos, 0x46464952);                         // "RIFF"
    setUint32(view, pos, length - 8);                         // file length - 8
    setUint32(view, pos, 0x45564157);                         // "WAVE"

    setUint32(view, pos, 0x20746d66);                         // "fmt " chunk
    setUint32(view, pos, 16);                                 // length = 16
    setUint16(view, pos, 1);                                  // PCM (uncompressed)
    setUint16(view, pos, numOfChan);
    setUint32(view, pos, abuffer.sampleRate);
    setUint32(view, pos, abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(view, pos, numOfChan * 2);                      // block-align
    setUint16(view, pos, 16);                                 // 16-bit (hardcoded in this demo)

    setUint32(view, pos, 0x61746164);                         // "data" - chunk
    setUint32(view, pos, length - pos - 4);                   // chunk length

    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while(pos < length) {
        for(i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // update data chunk
            pos += 2;
        }
    }
    offset++;                                     // next source sample
}

// Function that creates a version of wavesurfer from region selected
const trimAudio = {
    trimBlob: function(){
        // Selected audio snip.
        var snipStart = newRegion.start;
        var snipEnd = newRegion.end;
        var snipDuration = (snipEnd - snipStart);
        // Original audio buffer 
        var originalAudioBuffer = wavesurfer.backend.buffer;
        var snipLength = Math.floor(snipDuration * originalAudioBuffer.sampleRate);
        var offlineAudioContext = new OfflineAudioContext(1, 2, originalAudioBuffer.sampleRate );

        // Create audio buffer for selected audio region.

        var emptySegment = offlineAudioContext.createBuffer (
            originalAudioBuffer.numberOfChannels, snipLength , 
            originalAudioBuffer.sampleRate);

        var newAudioBuffer = offlineAudioContext.createBuffer(
            originalAudioBuffer.numberOfChannels,
            (snipStart === 0? (originalAudioBuffer.length - emptySegment.length): 
            originalAudioBuffer.length)
            , originalAudioBuffer.sampleRate );

        for (var i = 0; i < originalAudioBuffer.numberOfChannels; i++) {
            var newChanData = newAudioBuffer.getChannelData(i);
            var emptySegmentData = emptySegment.getChannelData(i);
            var originalChanData = originalAudioBuffer.getChannelData(i);
            var beforeData = originalChanData.subarray(0, snipStart * originalAudioBuffer.sampleRate);
            var afterData = originalChanData.subarray(Math.floor(snipEnd * originalAudioBuffer.sampleRate),
            (originalAudioBuffer.length * originalAudioBuffer.sampleRate));

            if (snipStart > 0){
                newChanData.set(beforeData);
                newChanData.set(emptySegmentData,(snipStart * newAudioBuffer.sampleRate));
                newChanData.set(afterData, (snipEnd * newAudioBuffer.sampleRate));
            } else {
                newChanData.set(afterData);
            }
        }
        var arrayBuffer = buffer2wav(newAudioBuffer);

        // create Blob
        // return (URL || webkitURL).createObjectURL(new Blob([buffer], {type: "audio/wav"}));
        return (new Blob([arrayBuffer], { type: "audio/wav"}));
    }
}
