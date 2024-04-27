// // Selectors
// const toDoInput = document.querySelector(".todo-input");
// const priorityInput = document.querySelector(".priority-input");
// const finishDateInput = document.querySelector(".finish-date-input");
//
// const toDoBtn = document.querySelector(".todo-btn");
//
// // Event Listeners
//
// if (toDoBtn) toDoBtn.addEventListener("click", addTask);
// if (toDoList) toDoList.addEventListener("click", deletecheck);
// document.addEventListener("DOMContentLoaded", getTodos);
//
// // Functions;
// function findStartTimeForTask(task) {
//   let todos = localStorage.getItem("todos");
//   if (todos === null || todos === "[]") {
//     let date = task.creationTimeAsDate;
//     date.setDate(date.getDate() + 1)
//     date.setHours(8, 0);
//     return date;
//   }
//
//   todos = JSON.parse(todos);
//   let lastTask = todos[todos.length - 1]
//   let lastTaskFinishDate = new Date(lastTask._startTime)
//   lastTaskFinishDate.setHours(lastTaskFinishDate.getHours() + parseInt(lastTask._duration))
//
//   if (lastTaskFinishDate.getHours() + parseInt(task.duration) > 17) {
//     lastTaskFinishDate.setDate(lastTaskFinishDate.getDate() + 1)
//     lastTaskFinishDate.setHours(8, 0);
//   }
//
//   return lastTaskFinishDate;
// }
// function addTask(event) {
//     event.preventDefault();
//
//     const description = toDoInput.value;
//     const priority = priorityInput.value;
//     const finishDate = new Date(finishDateInput.value);
//
//     if (!description) {
//     alert("You must enter description!");
//     } else if (!finishDate) {
//     alert("You must enter finish date!");
//     } else if (finishDate < new Date().setHours(0, 0, 0, 0)) {
//       alert("Finish date must be not earlier than current date!");
//     } else {
//     const task = new Task(description, priority, finishDate);
//     task.startTime = findStartTimeForTask(task);
//
//     displayTask(task);
//
//     // Adding to local storage;
//     saveSync(task);
//
//     // CLearing the input;
//     toDoInput.value = "";
//     priorityInput.value = "";
//     finishDateInput.value = "";
//   }
// }
//
//
//
//
//
// function removeLocalTasks(task) {
//   //Check: if item/s are there;
//   let todos;
//   if (localStorage.getItem("todos") === null) {
//     todos = [];
//   } else {
//     todos = JSON.parse(localStorage.getItem("todos"));
//     todos = todos.map((obj) => {
//       return new Task(obj._description, obj._duration, obj._startTime, obj._creationTime);
//     })
//   }
//
//   const description = task.children[0].children[0].innerText;
//   const duration = task.children[1].innerText;
//
//   let i;
//   for(i = 0; i < todos.length; ++i) {
//     if(todos[i].description === description &&
//         todos[i].duration === duration) {
//           break;
//     }
//   }
//
//   todos.splice(i, 1);
//   localStorage.setItem("todos", JSON.stringify(todos));
// }

// import {Task} from "./task";

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
    const creationTimeElement = todoElement.querySelector(".creation-time");
    const creationTime = creationTimeElement.getAttribute("datetime");

    try {
        let response = await fetch("/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ creationTime: creationTime }),
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
    const creationTimeElement = todoElement.querySelector(".creation-time");
    const creationTime = creationTimeElement.getAttribute("datetime");

    try {
        let response = await fetch("/tasks", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ creationTime: creationTime }),
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
    console.log(task.isDone);
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

async function loadTasks() {
    try {
        const response = await fetch("/tasks");
        const todos = await response.json();

        todos.forEach((todo) => {
            let task = new Task(
                todo._description,
                todo._priority,
                todo._finishDate,
                todo._creationTime,
                todo._isDone
            );
            displayTask(task);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

loadTasks();
