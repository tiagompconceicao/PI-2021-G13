/* criar todas as funcionalidades  */

const tasksDb = require("./covida-services")

let tasks = [0,1,2,3,4,5,6,7,8,9]

tasks = tasks.map((dc, i)=>{
    return {
        id: i,
        name: `task ${i}`,
        description: `Description of task ${i}`
    }
})

let maxId = tasks.length