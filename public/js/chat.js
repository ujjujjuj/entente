const memberContainer = document.getElementById("memberContainer");
const chatContainer = document.querySelector(".chatContainer");
const inputBox = document.querySelector(".chatbox input")
const socket = io()

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

function sendMessage(){
    message = inputBox.value;
    if(!message){
        return
    }
    inputBox.value = ""
    inputBox.focus()
    socket.emit("message",{"_id":readCookie("auth"),"message":message});
}
inputBox.addEventListener("keydown",(e)=>{
    if(e.keyCode == 13){
        sendMessage()
    }
})

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function addChat(data){
    let out = ""
    if(data.name == "You"){
        out += (`
        <div class = "chatown">
            <div class = "chatMessage">${data.message}</div>
        </div>
        `)
    }else{
        out += (`
            <div class = "chat">
                <img src = "/img/default2.png">
                <div class = "messageContainer">
                    <span class = "chatName">${data.name}</span>
                    <div class = "chatMessage">${data.message}</div>
                </div>
            </div>
        `)
    }
    chatContainer.innerHTML += out;
}

// if(!localStorage.chats){
//     localStorage.setItem("chats",'[{name: "You", message: "asdadadd"}]')
// }else{
//     //render chats
// }

renderMembers(members)
socket.emit("register",window.location.href.split("/").slice(-2)[0]);

socket.on("incoming",data => {
    console.log(data)
    addChat(data)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    //console.log(JSON.parse(localStorage.chats))
    //localStorage.chats = JSON.stringify(JSON.parse(localStorage.chats).push(data))
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
        setInterval(window.location=window.location.toString().replace('/chat','/notes'),1000)
    }else if(results.includes("goals") || results.includes("goal")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/chat','/goals'),1000)
    }else if(results.includes("files") || results.includes("file")){
        commandAudio.play()
        setInterval(window.location=window.location.toString().replace('/chat','/files'),1000)

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