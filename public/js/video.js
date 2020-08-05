const socket = io()
const myPeer = new Peer(undefined,{"host":"ez-peer-server.herokuapp.com","port":80})
const grid = document.querySelector(".videoGrid")

const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {}

navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream => {
    addVideo(myVideo,stream);

    myPeer.on("call",(call) => {
        call.answer(stream);
        const video = document.createElement("video")

        call.on("stream",(incomingStream)=>{
            addVideo(video,incomingStream)
        });

        console.log(stream);
    })

    socket.on("newVideo",id => {
        console.log(id," connected!")
        connectToNewUser(id,stream);
    })

    myPeer.on("close",()=>{
        video.remove();
    })

})

function addVideo(video, stream){
    video.srcObject = stream;
    video.addEventListener("loadedmetadata",() => {
        video.play()
    });
    grid.append(video);
}

function connectToNewUser(id,stream){
    const call = myPeer.call(id,stream);
    const newVid = document.createElement("video")
    call.on("stream",incomingStream => {
        addVideo(newVid,incomingStream);
    })
    call.on("close",() => {
        console.log(id+" disconnected")
        newVid.remove();
    })
    peers[id] = call;
}

myPeer.on("open",id => {
    socket.emit("joinRoom",{"room":window.location.href.split("/").slice(-2)[0],"id":id});
})

socket.on("userDisconnected",(id)=>{
    if(peers[id]){
        peers[id].close();
    }
})
