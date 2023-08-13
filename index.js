const addTaskDialog = document.getElementById("addTaskDialog");
const taskForm = document.getElementById("taskForm");

const openBtn = document.getElementById("openBtn");
const cancelBtn = document.getElementById("cancelBtn");

let taskId = null;

openBtn.addEventListener("click", () => {
    addTaskDialog.showModal();
});

cancelBtn.addEventListener("click", function(){
    taskForm.reset();
    taskId =null;
    addTaskDialog.close();
});

function saveTasks(tasks){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks(){
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function markAsCompleted(taskId){
    const tasks = getTasks();
    tasks[taskId].completed = true;
    saveTasks(tasks);
}

function addTask(name, description, email){
    const formData = {
        name: name,
        description: description,
        email: email,
        completed: false,
    };
    const tasks = getTasks();
    tasks.push(formData);
    saveTasks(tasks);
}

function submitTask(event){
    event.preventDefault();

    const name = taskForm.name.value;
    const description = taskForm.description.value;
    const email = taskForm.email.value;

    addTask(name, description, email);
    taskForm.reset();
    addTaskDialog.close();
    displayTasks();
}

function displayTasks(){
    const tasks = getTasks();

    uncompletedTasksList.innerHTML ="";
    completedTasksList.innerHTML = "";

    tasks.forEach((task,index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task";
        taskItem.innerHTML = `
        <p>Title: ${task.name}</p>
        <p>Description: ${task.description}</p>
        <p>Email: ${task.email}</p>
        <button class="deleteBtn">Delete</button>
        `;

        if (task.completed){
            taskItem.classList.add("completed");
        }
        else {
            taskItem.innerHTML +=`
            <button class="completeBtn">Mark as complete</button>
            `;

            const completeBtn = taskItem.querySelector(".completeBtn");
            completeBtn.addEventListener("click", () => {
                markAsCompleted(index);
                displayTasks();
            });
        }

        const deleteBtn = taskItem.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", ()=> {
            tasks.splice(index, 1);
            saveTasks(tasks);
            displayTasks();
        });


        if (task.completed){
            completedTasksList.appendChild(taskItem);
        }
        else {
            uncompletedTasksList.appendChild(taskItem);
        }
    });
}

taskForm.addEventListener("submit", submitTask);
displayTasks();