/*window.onload = function() {
    const editGroup = document.getElementById("editGroupButton")

    editGroup.onsubmit = function(){
        //make put 
    }


}*/
function editGroup(id){
    const name = document.getElementById("groupName")
    const description = document.getElementById("groupDescription")

    fetch(`/covida/site/groups/${id}`, { method: 'UPDATE' })
}

function filterGames(id){
    const min = document.getElementById("minRating")
    const max = document.getElementById("maxRating")

    if(!min.value || min.value < 0) min.value = 0
    if(!max.value || min.value > 100) max.value = 100

    if(min.value > max.value) {
        const aux = min.value
        min.value = max.value
        max.value = aux
    }

    fetch(`/covida/site/groups/${id}/${min.value}/${max.value}`).then(games => {
        render("specificGroup",games)
    })
}

