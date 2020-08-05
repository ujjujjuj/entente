const memberContainer = document.getElementById("memberContainer");
const noteContainer = document.getElementById("noteContainer");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addNote = document.querySelector(".fa-plus-circle");
const modal = document.querySelector(".modal");

function renderMembers(input){
    let admins = '<span class="head">Admins</span>\n';
    let users = '<span class="head">Users</span>\n';
    let customers = '<span class="head">Customers</span>\n';
    input.forEach(member => {
        let elem = `<span><img src = "/img/default2.png">${member.name}</span>\n`
        if(member.type == "admin"){
            admins += elem
        }else if(member.type == "user"){
            users += elem
        }else{
            customers += elem;
        }
    });
    memberContainer.innerHTML = (
        "<div class='admins'>"+admins+"</div>"+
        "<div class='users'>"+users+"</div>"+
        "<div class='customers'>"+customers+"</div>"
    )
}

function renderNotes(notes,isAdmin){
    let out = '';
    notes.forEach(note => {
        console.log(note)
        let date = new Date(note.date).toISOString().replace("T"," ").replace("Z"," ").slice(0,-4)
        if(isAdmin){
            out += (`
            <div class = "noteHolder">
                <div class = "note" id = "${note.id}">
                    <span class = "date">${date}</span>
                    <span class = "desc">${note.description}</span>
                    <img src = "/img/trash.png" onclick=deleteNote(this.parentNode.id)>
                </div>
            </div>
            `)
        }else{
            out += (`
            <div class = "noteHolder">
                <div class = "note" id = "${note.id}">
                    <span class = "date">${date}</span>
                    <span class = "desc">${note.description}</span>
                </div>
            </div>
            `)
        }
    });
    noteContainer.innerHTML = out;
}

function deleteNote(id){
    let url = window.location.href+"/delete?id="+id
    console.log(url);
    fetch(url,{method:"POST"})
    window.location.reload();
}

searchBar.addEventListener("keyup",(e) => {
    let searchString = e.target.value;
    let filtered = notes.filter( note => {
        return note.description.toLowerCase().includes(searchString.toLowerCase())
    });
    renderNotes(filtered,isAdmin)
});

addNote.addEventListener("click",()=>{
    modal.style.display = "flex";
})

modalClose.addEventListener("click",()=>{
    modal.style.display = "none";
})

/* ********* TEXT TO SPEECH ********* */

const speech = window.speechSynthesis;
speechStack = []

function readAll(){
    if(speech.speaking){
        return
    }
    for(i=0;i<notes.length;i++){
        speechStack.push(notes[i].description)
    }
    readText(speechStack[0])
}

function readText(text){

    let tts = new window.SpeechSynthesisUtterance(text);
    console.log("Speaking: "+text)
    tts.lang = "en-US";
    tts.volume = 0.5
    speech.speak(tts);
    tts.addEventListener("end", () => {
        console.log("end")
        nextText();
    })
}

function nextText(){
    if(speech.speaking){
        console.log("forced end..")
        speech.cancel()
        return
    }
    speechStack.shift()
    if(speechStack[0]){
        readText(speechStack[0])
    }else{
        stop();
    }
}

function stopSpeech(){
    speech.cancel();
    speechStack = [];
}

/* ********* VOICE RECOGNITION ********* */
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition()
//recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = "en-US";

isListening = false

const startAudio = new Audio("/on.mp3");
startAudio.volume = 0.3
const commandAudio = new Audio("/command.mp3");
commandAudio.volume = 0.3
const endAudio = new Audio("/off.mp3");
endAudio.volume = 0.3

results = ""

function listen(){
    startAudio.play()
    recognition.start();
    isListening = true;
}
function stop(){
    endAudio.play()
    recognition.stop();
    isListening = false;
}
function restart(){
    recognition.stop();
}
recognition.onstart = ()=>{
    console.log("started")
}
recognition.onresult = (e) => {
    results = ""
    for(i=0;i<e.results.length;i++){
        results += e.results[i][0].transcript + " "
    }
    console.log(results)

    if(results.includes("read") || results.includes("start")){
        commandAudio.play()
        readAll();
        restart();
    }else if(results.includes("next")){
        commandAudio.play()
        nextText();
        restart();
    }else if(results.includes("end") || results.includes("stop")){
        stopSpeech()
        stop()
    }else if(results.includes("goals") || results.includes("goal")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/notes','/goals'),1000)
    }else if(results.includes("files") || results.includes("file")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/notes','/files'),1000)
    }else if(results.includes("chats") || results.includes("chat")  || results.includes("charts")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/notes','/chat'),1000)
    }

}
recognition.onerror = e =>{
    console.log("error:")
    console.log(e)
}
recognition.onend =  ()=>{
    console.log(speech.speaking)
    if(!speech.speaking && isListening){
        console.log("stopped listening");
        recognition.stop();
        stop()
    }else{
        console.log("restarted")
        recognition.start();
    }
    
}

/* ********* TEST KEY COMMAND(S) ********* */

document.addEventListener("keydown",(e) => {
    if(e.keyCode == 192){
        listen()
    }
})

renderMembers(members)
renderNotes(notes,isAdmin)