/*Obter a lista dos jogos mais populares
Pesquisar jogos pelo nome
Gerir grupos de jogos favoritos
Criar grupo atribuindo-lhe um nome e descrição
Editar grupo, alterando o seu nome e descrição
Listar todos os grupos
Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem.
Adicionar um jogo a um grupo
Remover um jogo de um grupo
Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores (mínimo e máximo) entre 0 e 100, 
sendo estes valores parametrizáveis no pedido. Os jogos vêm ordenadas por ordem decrescente da votação média.
*/

const tasksDb = require ("./covida-db")

module.exports = {
    getAllTasks: getAllTasks,
    getTask: this.getTask,
    createTask: createTask,
    deleteTask: deleteTask,
    uptadeTask: uptadeTask
}


// getAllTasks tem que ser assincrona. por isso leva um callback
function getAllTasks (cb ) {
    tasksDb 
}

function getTask (idTask, cb ) {

}

function createTask (task, cb ) {

}

function deleteTask (idTask, cb ) {

}
// pode receber um idtask ou uma task se a task ja vier com o id
function updateTask (task ,cb ) {

}