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
        let elem = `<span><img src = "/img/default.png">${member.name}</span>\n`
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

renderMembers(members)
renderNotes(notes,isAdmin)