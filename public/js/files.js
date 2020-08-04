const memberContainer = document.getElementById("memberContainer");
const fileContainer = document.querySelector(".fileContainer");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addFile = document.querySelector(".fa-plus-circle");
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

function renderFiles(files){
    let out = '';
    files.forEach(file => {
        console.log(file)
        out += (`
        <div class = "file">
            <div class = "fileHead" id = ${file._id}>
                <span class = "fileTitle">${file.name}</span>
                <i class="fa fa-download" aria-hidden="true" onclick = download(this.parentNode.id)></i>
            </div>
            <div class = "fileExtension">
                Extension: ${file.extension}
            </div>
            <div class="fileDate">
                Date of upload: ${new Date(file.date).toUTCString()}
            </div>
        </div>
        `)
    });
    fileContainer.innerHTML = out;
}

function download(id){
    window.location = window.location + "/download?id=" + id
}

function completeGoal(id){
    let url = window.location.href+"/resolve?id="+id
    console.log(url);
    fetch(url,{method:"POST"})
    window.location.reload();
}

searchBar.addEventListener("keyup",(e) => {
    let searchString = e.target.value;
    let filtered = goals.filter( goal => {
        return goal.title.toLowerCase().includes(searchString.toLowerCase())
    });
    renderGoals(filtered,isAdmin)
});

addFile.addEventListener("click",()=>{
    modal.style.display = "flex";
})

modalClose.addEventListener("click",()=>{
    modal.style.display = "none";
})

/* ********* VOICE RECOGNITION ********* */
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition()
//recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = "en-US";

const startAudio = new Audio("/on.mp3");
startAudio.volume = 0.3
const commandAudio = new Audio("/command.mp3");
commandAudio.volume = 0.3
const endAudio = new Audio("/off.mp3");
endAudio.volume = 0.3

isListening = false

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

    if(results.includes("notes") || results.includes("note")){      
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/files','/notes'),1000)
    }else if(results.includes("goals") || results.includes("goal")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/files','/goals'),1000)
    }else if(results.includes("chats") || results.includes("chat") || results.includes("charts")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/files','/chat'),1000)

    }
}
recognition.onerror = e =>{
    stop()
    console.log("error:")
    console.log(e)
}
recognition.onend =  ()=>{
    stop()
}

/* ********* TEST KEY COMMAND(S) ********* */

document.addEventListener("keydown",(e) => {
    if(e.keyCode == 192){
        listen()
    }
})

renderMembers(members)
renderFiles(files);