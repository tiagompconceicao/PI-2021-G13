function searchGames(){
    const gameName = document.getElementById("gameName")

    if(!gameName.value) {
        //error input
    }

    fetch(`/covida/site/games/${gameName.value}`).then(res => {
        res.text().then(text => {
            document.body.innerHTML = ""
            document.write(text)
        })
    })
}

function addGameToGroup(gameId){
    const url = document.baseURI
    fetch(`${url}/${gameId}`, { method: 'PUT'}).then(res => {
        window.location.replace(res.url)
    })
}