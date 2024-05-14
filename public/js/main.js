const toDoList = document.querySelector(".todo-list");

async function addTaskToDB(event) {
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
}

document
    .getElementById("form")
    .addEventListener("submit", addTaskToDB);

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

async function checkTask() {
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


async function editTaskInDB(event) {
    event.preventDefault();

    const formData = new FormData(this);
    formData.set("taskId", this.getAttribute("task-id"));

    try {
        let response = await fetch("/tasks", {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const responseData = await response.json();
        if (responseData.redirect)
            window.location.href = responseData.redirect;
        if (responseData.error_message)
            alert(responseData.error_message)
    } catch (err) {
        console.log(err);
    }

}

function showEditTaskMenu(taskLiItem) {
    const taskId = taskLiItem.getAttribute("id");
    const description = taskLiItem.querySelector('.todo-item-description').textContent;
    const priority = taskLiItem.querySelector('.todo-item-priority').textContent;
    const finishDate = taskLiItem.querySelector('.todo-buttons-div').previousElementSibling.textContent;

    const form = document.getElementById("form");
    form.setAttribute("task-id", taskId);

    const descriptionField = document.getElementById('description');
    descriptionField.value = description;
    descriptionField.placeholder = "Edit the task.";

    const prioritySelect = document.getElementById('priority');
    prioritySelect.value = priority === 'High' ? '1' : priority === 'Medium' ? '2' : '3';

    const [day, month, year] = finishDate.split('.');
    document.getElementById('finishDate').value = `${year}-${month}-${day}`;
    document.querySelector('.todo-btn').textContent = "Edit Task!";

    form.method = "put";

    document
        .getElementById("form")
        .removeEventListener("submit", addTaskToDB);

    document
        .getElementById("form")
        .addEventListener("submit", editTaskInDB);

    clearChildren('.sort-buttons');
    clearChildren('.todo-list');
}

async function editTask() {
    showEditTaskMenu(this.closest("li"));

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
    creationTimeDiv.setAttribute("datetime", task.createdAt);

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

    newPriority.innerText = task.Priority.description;
    newPriority.classList.add("todo-item");
    newPriority.classList.add("todo-item-priority");
    taskLi.appendChild(newPriority);

    newFinishDate.innerText = task.finishDateAsString;
    newFinishDate.classList.add("todo-item");
    taskLi.appendChild(newFinishDate);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>\n';
    editButton.classList.add("edit-btn", `standard-button`);
    editButton.addEventListener("click", editTask);
    buttonsDiv.appendChild(editButton);

    const checkedButton = document.createElement("button");
    checkedButton.innerHTML = '<i class="fas fa-check"></i>';
    checkedButton.classList.add("check-btn", `standard-button`);
    checkedButton.addEventListener("click", checkTask);
    buttonsDiv.appendChild(checkedButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn", `standard-button`);
    deleteButton.addEventListener("click", deleteTask);

    buttonsDiv.appendChild(deleteButton);
    taskLi.appendChild(buttonsDiv);
    toDoList.appendChild(taskLi);
}

async function loadTasks(sortOrders) {
    try {
        const queryString = `?sortOrders=${encodeURIComponent(JSON.stringify(sortOrders || []))}`;
        const response = await fetch("/tasks" + queryString)
        const todos = await response.json();
        console.log(todos);
        todos.forEach((todo) => {
            displayTask(todo);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

loadTasks();


let prioritySortOrder = 0;
let finishDateSortOrder = 0;


function clearChildren(className) {
    const element = document.querySelector(className);
    while (element.firstChild)
        element.removeChild(element.firstChild);
}


function sortTasksByPriority() {
    prioritySortOrder = (prioritySortOrder+1) % 3;
    clearChildren('.todo-list');
    loadTasks([["priority", prioritySortOrder], ["finishDate", finishDateSortOrder]]);

    const button = document.getElementById("priority-sort-button");
    let buttonText = "By priority";

    if(prioritySortOrder === 1)
        buttonText += " ↓";
    else if(prioritySortOrder === 2)
        buttonText += " ↑";

    button.textContent = buttonText;
}

function sortTasksByFinishDate() {
    finishDateSortOrder = (finishDateSortOrder+1) % 3;
    clearChildren('.todo-list');
    loadTasks([["finishDate", finishDateSortOrder], ["priority", prioritySortOrder]]);

    const button = document.getElementById("finish-date-sort-button");
    let buttonText = "By finish date";

    if(finishDateSortOrder === 1)
        buttonText += " ↓";
    else if(finishDateSortOrder === 2)
        buttonText += " ↑";

    button.textContent = buttonText;
}
