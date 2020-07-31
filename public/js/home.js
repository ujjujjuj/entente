const projectContainer = document.querySelector(".projects");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addProject = document.querySelector(".fa-plus-circle");
const modal = document.querySelector(".modal");

function render(input,isAdmin){
    out = ""
    for(i=0;i<input.length;i++){
        if(isAdmin){
            out += (`
                <div class = "projectInfo">
                    <span class = "projectName">${input[i].name}</span>
                    <span class = "memberCount">${input[i].members} members</span>
                    <span class = "description">${input[i].description}</span>
                    <div>
                    <button class = "openProject" onclick="window.location.href='/project/${input[i].name}/notes'">Open</button>
                    <button class="invite" onclick="window.location.href='/project/${input[i].name}/invite'">Invite</button>
                    </div>
                </div>
            `)
        }else{
            out += (`
                <div class = "projectInfo">
                    <span class = "projectName">${input[i].name}</span>
                    <span class = "memberCount">${input[i].members} members</span>
                    <span class = "description">${input[i].description}</span>
                    <button class = "openProject" onclick="window.location.href='/project/${input[i].name}/notes'">Open</button>
                </div>
            `)
        }
    }
    projectContainer.innerHTML = out

}

searchBar.addEventListener("keyup",(e) => {
    let searchString = e.target.value;
    let filtered = projects.filter( project => {
        return project.name.includes(searchString)
    });
    render(filtered,isAdmin)
});
if(addProject){
    addProject.addEventListener("click",()=>{
        modal.style.display = "flex";
    })
}

modalClose.addEventListener("click",()=>{
    modal.style.display = "none";
})

render(projects,isAdmin)
    