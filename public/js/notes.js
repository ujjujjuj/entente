const memberContainer = document.getElementById("memberContainer");
const noteContainer = document.getElementById("noteContainer");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addNote = document.querySelector(".fa-plus-circle");
const modal = document.querySelector(".modal");

function renderMembers(input){
    let admins = '<span class="head">Admins</span>\n';
    let members = '<span class="head">Members</span>\n';
    let customers = '<span class="head">Customers</span>\n';
    input.forEach(member => {
        let elem = `<span><img src = "/img/default.png">${member.name}<span>\n`
        if(member.type == "admin"){
            admins += elem
        }else if(member.type == "member"){
            members += elem
        }else{
            customers += elem;
        }
    });
    memberContainer.innerHTML = (
        "<div class='admins'>"+admins+"</div>"+
        "<div class='members'>"+members+"</div>"+
        "<div class='customers'>"+customers+"</div>"
    )
}

function renderNotes(notes){
    let out = '';
    notes.forEach(note => {
        let date = new Date(note.date).toISOString().replace("T"," ").replace("Z"," ").slice(0,-4)
        out += (`
        <div class = "noteHolder">
            <div class = "note">
                <span class = "date">${date}</span>
                <span class = "desc">${note.description}</span>
                <img src = "/img/trash.png">
            </div>
        </div>
        `)
    });
    noteContainer.innerHTML = out;
}

searchBar.addEventListener("keyup",(e) => {
    let searchString = e.target.value;
    let filtered = notes.filter( note => {
        return note.description.includes(searchString)
    });
    renderNotes(filtered)
});

addNote.addEventListener("click",()=>{
    modal.style.display = "flex";
})

modalClose.addEventListener("click",()=>{
    modal.style.display = "none";
})

renderMembers(members)
renderNotes(notes)