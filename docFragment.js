function docFragment() {
    // array of audio information to be dispalyed
    const array1 = [                
        {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 1',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 2',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 3',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 4',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        },  {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 5',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 6',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 7',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }, {
            src: 'file:///Users/yari/Projects/tair/ScrappingTool/scrape_93.7M_2018-01-08T04_44_42.540Z.wav',
            title: 'un titulo 8',
            timestamp: "MM-DD-YYY T HH:MM:MM"
        }
    ];
    // creates document fragment
    var fragment = document.createDocumentFragment(); 

    // creates DOM elements with attributes
    while (array1.length > 0) {
        var div = document.createElement("div");
        var h4 = document.createElement("h4");
        var audio = document.createElement("audio");
        var p = document.createElement("p");
        var button = document.createElement("button");
        var source = document.createElement("source");
        var currentRecord = array1.pop();
    
    // sets class attribute to DOM element
        div.setAttribute("class","container");
        h4.setAttribute("class","stationID");
        audio.setAttribute("class","controls");
        p.setAttribute("class","transDate");
        button.setAttribute("class","claim");
    
        // defines text that will be displayed DOM element
        h4.innerText = currentRecord.title;
        p.innerText = currentRecord.timestamp;
        button.innerText = "Claim Audio";
        button.onclick = function () {
            var confirmWindow = window.confirm("Are you sure you want to claim this audio file?");
            if (confirmWindow === true){
                this.disabled = true;
            }
        }
        audio.controls = true;  
        source.type = "audio/wav";
        source.src = currentRecord.src;

        // append element to fragment
        audio.appendChild(source);
        div.appendChild(h4);
        div.appendChild(p);
        div.appendChild(audio);
        div.appendChild(button); 


        // append div to fragment
        fragment.appendChild(div); 
    }
    // append fragment to DOM
    document.getElementsByTagName('body')[0].appendChild(fragment);
}

