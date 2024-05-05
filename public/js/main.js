const toDoList = document.querySelector(".todo-list");

document
    .getElementById("form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData(this);

        try {
            let response = await fetch("/tasks", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const responseData = await response.json();
            if (responseData.redirect)
                window.location.href = responseData.redirect;
        } catch (err) {
            console.log(err);
        }
    });

function validateForm() {
    const description = document.getElementById("description").value;
    const finishDate = document.getElementById("finishDate").value;

    if (!description) {
        alert("You must enter description!");
        return false;
    }

    if (!finishDate) {
        alert("You must enter finish date!");
        return false;
    }

    if (finishDate < new Date().setHours(0, 0, 0, 0)) {
        alert("Finish date must be not earlier than current date!");
        return false;
    }

    return true;
}

async function deleteTask() {
    const todoElement = this.closest("li");
    const taskId = todoElement.getAttribute("id");

    try {
        let response = await fetch("/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId: taskId }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const responseData = await response.json();
        if (responseData.redirect) window.location.href = responseData.redirect;
    } catch (err) {
        console.log(err);
    }
}

async function updateTask() {
    const todoElement = this.closest("li");
    const taskId = todoElement.getAttribute("id");

    try {
        let response = await fetch("/tasks", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId: taskId }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const responseData = await response.json();
        if (responseData.redirect) window.location.href = responseData.redirect;
    } catch (err) {
        console.log(err);
    }
}

function displayTask(task) {
    const taskLi = document.createElement("li");
    const leftDiv = document.createElement("div");
    const creationTimeDiv = document.createElement("div");
    const buttonsDiv = document.createElement("div");

    taskLi.classList.add("todo", `standard-todo`);
    taskLi.setAttribute("id", task.id);
    if (task.isDone) taskLi.classList.add("completed");

    leftDiv.classList.add("todo-left-div");
    buttonsDiv.classList.add("todo-buttons-div");
    creationTimeDiv.classList.add("creation-time");
    creationTimeDiv.setAttribute("datetime", task.creationTime);

    const newTask = document.createElement("div");
    const newPriority = document.createElement("div");
    const newFinishDate = document.createElement("div");

    newTask.innerText = task.description;
    newTask.classList.add("todo-item");
    newTask.classList.add("todo-item-description");
    leftDiv.appendChild(newTask);

    creationTimeDiv.innerText = task.creationTimeAsString;
    leftDiv.appendChild(creationTimeDiv);
    taskLi.appendChild(leftDiv);

    newPriority.innerText = task.priorityAsString;
    newPriority.classList.add("todo-item");
    newPriority.classList.add("todo-item-priority");
    taskLi.appendChild(newPriority);

    newFinishDate.innerText = task.finishDateAsString;
    newFinishDate.classList.add("todo-item");
    taskLi.appendChild(newFinishDate);

    const checkedButton = document.createElement("button");
    checkedButton.innerHTML = '<i class="fas fa-check"></i>';
    checkedButton.classList.add("check-btn", `standard-button`);
    checkedButton.addEventListener("click", updateTask);
    buttonsDiv.appendChild(checkedButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn", `standard-button`);
    deleteButton.addEventListener("click", deleteTask);

    buttonsDiv.appendChild(deleteButton);

    taskLi.appendChild(buttonsDiv);

    // Append to list;
    toDoList.appendChild(taskLi);
}

async function loadTasks(sortOrders) {
    try {
        const queryString = `?sortOrders=${encodeURIComponent(JSON.stringify(sortOrders || []))}`;
        const response = await fetch("/tasks" + queryString)
        const todos = await response.json();

        todos.forEach((todo) => {
            let task = new Task(
                todo.task_id,
                todo.description,
                todo.priority,
                todo.finishdate,
                todo.creationtime,
                todo.isdone
            );
            displayTask(task);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

loadTasks();


let prioritySortOrder = 0;
let finishDateSortOrder = 0;


function clearTasks() {
    const ul = document.querySelector('.todo-list');
    while (ul.firstChild)
        ul.removeChild(ul.firstChild);
}

function sortTasksByPriority() {
    prioritySortOrder = (prioritySortOrder+1) % 3;
    clearTasks();
    loadTasks([["priority", prioritySortOrder], ["finishDate", finishDateSortOrder]]);
}

function sortTasksByFinishDate() {
    finishDateSortOrder = (finishDateSortOrder+1) % 3;
    clearTasks();
    loadTasks([["finishDate", finishDateSortOrder], ["priority", prioritySortOrder]]);
}
