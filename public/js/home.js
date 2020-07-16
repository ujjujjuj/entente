const projectContainer = document.querySelector(".projects");
const searchBar = document.getElementById("searchBar");
const modalClose = document.querySelector(".fa-times-circle");
const addProject = document.querySelector(".fa-plus-circle");
const modal = document.querySelector(".modal");

function render(input){
    out = ""
    for(i=0;i<input.length;i++){
        out += (`
            <div class = "projectInfo">
                <span class = "projectName">${input[i].name}</span>
                <span class = "memberCount">${input[i].members} members</span>
                <span class = "description">${input[i].description}</span>
                <button class = "openProject" onclick="window.location.href='/projects/${input[i].name}'">Open</button>
            </div>
        `)
    }
    projectContainer.innerHTML = out

}

searchBar.addEventListener("keyup",(e) => {
    let searchString = e.target.value;
    let filtered = projects.filter( project => {
        return project.name.includes(searchString)
    });
    render(filtered)
});

addProject.addEventListener("click",()=>{
    modal.style.display = "flex";
})

modalClose.addEventListener("click",()=>{
    modal.style.display = "none";
})

render(projects)
    