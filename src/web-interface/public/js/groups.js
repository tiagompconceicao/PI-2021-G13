function deleteGroup(id){
    fetch(`/covida/site/groups/${id}`, { method: 'DELETE' }).then(res => {
        window.location.replace(res.url)
    })
}

function logout(){
    fetch(`/covida/user/logout`, { method: 'POST' }).then(res => {
        window.location.replace(res.url)
    })
}