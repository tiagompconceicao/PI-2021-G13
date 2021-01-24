function editGroup(id){
    const name = document.getElementById("groupName")
    const description = document.getElementById("groupDescription")
    
    const body = {name : name.value, description: description.value}

    fetch(`/covida/site/groups/${id}`, { 
        method: 'PUT',
        headers: {'Accept': 'application/json','Content-Type': 'application/json'}, 
        body: JSON.stringify(body) 
    }).then(result => {
        
    })
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
        console.log(games)

    })
}

function removeGameFromGroup(item, groupId, gameId){
   // const groupId = "{{group}}" //document.getElementById("group")
    console.log(groupId)
    fetch(`/covida/site/groups/${groupId}/games/${gameId}`, {method: 'DELETE'}).then(result => {
        item.remove()
    })
}

