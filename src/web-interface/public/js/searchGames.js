function searchGames(){
    const gameName = document.getElementById("gameName")

    if(!gameName.value) {
        //error input
    }

    fetch(`/covida/site/games/${gameName.value}`).then(res => {
        document.write(res.text)
    })
}