const memberContainer = document.getElementById("memberContainer");
const goalContainer = document.querySelector(".goalContainer");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addGoal = document.querySelector(".fa-plus-circle");
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

function renderGoals(goals,isAdmin){
    let out = '';
    goals.forEach(goal => {
        console.log(goal)
        let failed;
        let timeleft = new Date(goal.deadline).getTime() - new Date(goal.date).getTime()
        if(timeleft < 0){
            failed = true;
        }else{
            failed = false;
        }
        console.log(timeleft)
        if(!failed){
            let hoursLeft = Math.floor(timeleft/3600000);
       
            if(!goal.isCompleted){
                out += (`
                <div class = "goal" id = "${goal._id}">
                    <span class = "goalTitle">${goal.title}</span>
                    <span class = "goalStart">Started ${new Date(goal.date).toUTCString()}</span>
                    <span class = "goalDeadline">${hoursLeft} hours till deadline.</span>
                    <i class="fa fa-check-circle" aria-hidden="true" style = "color:#AFAFAF" onclick=completeGoal(this.parentNode.id)></i>
                </div>
                `)
            }else{
                out += (`
                <div class = "goal" id = "${goal._id}">
                    <span class = "goalTitle">${goal.title}</span>
                    <span class = "goalStart">Started ${new Date(goal.date).toUTCString()}</span>
                    <span class = "goalDeadline" style = "color:#72E0A9;">Completed!</span>
                    <i class="fa fa-check-circle" aria-hidden="true" style = "color:#72E0A9"></i>
                </div>
                `)
            }
        }else{
            out += (`
            <div class = "goal" id = "${goal._id}">
                <span class = "goalTitle">${goal.title}</span>
                <span class = "goalStart">Started ${new Date(goal.date).toUTCString()}</span>
                <span class = "goalDeadline" style = "color:#FF5773;">Deadline expired.</span>
                <i class="fa fa-times-circle" aria-hidden="true" style = "color:#FF5773"></i>
            </div>
            `)
        }
    
    });
    goalContainer.innerHTML = out;
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

addGoal.addEventListener("click",()=>{
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
    for(i=0;i<goals.length;i++){
        speechStack.push(goals[i].title)
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
    recognition.stop();
    endAudio.play()
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
    }else if(results.includes("notes") || results.includes("note")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/goals','/notes'),1000)
    }else if(results.includes("files") || results.includes("file")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/goals','/files'),1000)
    }else if(results.includes("chats") || results.includes("chat")  || results.includes("charts")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/goals','/chat'),1000)
    }

}
recognition.onerror = e =>{
    console.log("error:")
    console.log(e)
}
recognition.onend =  ()=>{
    console.log(speech.speaking)
    if(!speech.speaking && isListening){
        stopSpeech()
        console.log("stopped listening");
        stop();
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
renderGoals(goals);