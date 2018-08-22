//Global variables
const sampleRate = 22050; 
const totalBytes = 353929; //in bytes
var audioFile = "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3";
var buttons = {     // Button assignment
    play: document.getElementById( "btn-play" ),
    pause: document.getElementById( "btn-pause" ),
    delete: document.getElementById( "btn-delete" ),
    snip: document.getElementById( "btn-snip" )
};
var wavesurfer = WaveSurfer.create({        // Audiowave form object definition
    container: '#waveform',
    waveColor: '#bcbcbc',
    progressColor: '#0069c0',
});
var region = document.getElementsByClassName( "wavesurfer-region");
var confirmWindow ;
var audioBlob;
var snipStart;
var snipEnd;
var audioContext;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Create audio blob with original content
fetch(audioFile)
    .then(response => {
        if(response.ok) {
            return response.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        audioBlob = data
    })

// Add click event to play button. Audio plays and play button is disabled
buttons.play.addEventListener( "click", function() {
    wavesurfer.play();
    buttons.play.disabled = true;
    buttons.pause.disabled = false;
    buttons.delete.disabled = false;
    buttons.snip.disabled = false;
});

// Add click event to pause button. Audio pauses, and psuse button is disabled
buttons.pause.addEventListener( "click", function() {
    wavesurfer.pause();
    buttons.delete.disabled = false;
    buttons.pause.disabled = true;
    buttons.play.disabled = false ;
    buttons.snip.disabled = false;
});

// Add click event to delete button. Audio stops and goes to the beginning. Regions are deleted.
buttons.delete.addEventListener( "click", function() {
    wavesurfer.stop();
    wavesurfer.clearRegions();
    buttons.delete.disabled = false;
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
});


//Time to byte and number to byte conversion function
// function timeConversion() {
//     let regionTime = region[0].title;               //Start and end time as string
//     console.log(regionTime);

//     regionTime = regionTime.split('-');             //Creates start and end time array
    
//     let startTime = regionTime[0].split(':');       //Splits start time into its own array
//     let endTime = regionTime[1].split(':');       //Splits end time array into its own array
    
//     if ( startTime.length === 2 || endTime.length === 2) {          //hour, min, and secs conversion to fraction of hour
//         startTime = (parseFloat(startTime[0]) / 60) + (parseFloat(startTime[1]) / 3600);
//         endTime = (parseFloat(endTime[0]) / 60) + (parseFloat(endTime[1]) / 3600);
//     } else if (endTime.length = 3 || endTime.length === 3) {
//         startTime = parseFloat(startTime[0]) + (parseFloat(startTime[1]) / 60) + (parseFloat(startTime[2]) / 3600);
//         endTime = parseFloat(endTime[0]) + (parseFloat(endTime[1]) / 60) + (parseFloat(endTime[2]) / 3600);    
//     }
//     console.log(startTime, endTime);

//     snipStart = startTime * sampleRate;
//     snipEnd = endTime * sampleRate;
//     console.log(snipStart, snipEnd);

//     audioInstance(snipStart, snipEnd);
// };

// Creates audio blob for selected audio
function audioInstance() {
    let snipStart = 10;
    let snipEnd = 20;
    let audioBlobInstance = audioBlob.slice( snipStart, snipEnd, "audio/mp3" );
    console.log(audioBlobInstance);
    renderWaveform(audioBlobInstance);
};

function renderWaveform(audioBlobInstance) {
    let domEl = document.createElement('div');
    document.querySelector('.body').appendChild(domEl);
    
    let waveAudioInstance = WaveSurfer.create({
      container: domEl,
      waveColor: 'red',
      progressColor: 'purple',
      hideScrollbar: true
    });
    waveAudioInstance.loadBlob(audioBlobInstance);
    console.log('hey');

    return waveAudioInstance;
}

// Region confirmation
function regionConfirmation() {
    confirmWindow = window.confirm( "Ready to snip, OK?" );
        if (confirmWindow === true) {
            audioInstance();
        }
};

// Add click event to snip button. User confirms audio snip. Drag and resize for confirmed audio (region) disabled.
buttons.snip.addEventListener( "click", regionConfirmation);


// Resize elements on webpage.
window.addEventListener( "resize", function() {
    var currentProgress = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
    wavesurfer.empty() ;
    wavesurfer.drawBuffer() ;
    // wavesurfer.seekto(currentProgress)
    buttons.pause.disabled = true ;
    buttons.play.disabled = false ;
    buttons.delete.disabled = false ;
});

// Load audio displayed as waveform
wavesurfer.load(audioFile); 

// Initiate wavesurfer and audio region selection plug-in.
wavesurfer.on( "ready", function() {
    buttons.play.disabled = false;
    wavesurfer.enableDragSelection({ color: '#4f87de2e' });
    // Timeline variables
    var timeline = Object.create(WaveSurfer.Timeline);
    timeline.init({
        wavesurfer: wavesurfer,
        container: '#waveform-timeline'
    });
});