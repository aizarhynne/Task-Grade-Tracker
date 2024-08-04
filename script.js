// Get references to the DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksTableBody = document.getElementById('tasks-table').getElementsByTagName('tbody')[0];

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Save task to local storage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Add task to DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        ${task}
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    todoList.appendChild(li);

    const row = tasksTableBody.insertRow();
    row.innerHTML = `
        <td class="task-cell">${task}</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true" class="m1-cell"></td>
        <td contenteditable="true" class="m2-cell"></td>
        <td contenteditable="true" class="m3-cell"></td>
        <td class="final-grade-cell"></td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
}

// Event listener for form submission
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        todoInput.value = '';
    }
});

// Event listener for delete and edit buttons
todoList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.parentElement;
        deleteTaskFromLocalStorage(taskItem.textContent.trim());
        taskItem.remove();
        removeTaskFromTable(taskItem.textContent.trim());
    } else if (e.target.classList.contains('edit-btn')) {
        const taskItem = e.target.parentElement;
        const newTask = prompt("Edit your task:", taskItem.textContent.trim());
        if (newTask) {
            editTaskInLocalStorage(taskItem.textContent.trim(), newTask);
            taskItem.childNodes[0].nodeValue = newTask;
            updateTaskInTable(taskItem.textContent.trim(), newTask);
        }
    }
});

// Event listener for delete and edit buttons in the table
tasksTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.parentElement.parentElement;
        const task = row.cells[0].textContent.trim();
        deleteTaskFromLocalStorage(task);
        row.remove();
        removeTaskFromList(task);
    } else if (e.target.classList.contains('edit-btn')) {
        const row = e.target.parentElement.parentElement;
        const task = row.cells[0].textContent.trim();
        const newTask = prompt("Edit your task:", task);
        if (newTask) {
            editTaskInLocalStorage(task, newTask);
            row.cells[0].textContent = newTask;
            updateTaskInList(task, newTask);
        }
    }
});

function deleteTaskFromLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTaskInLocalStorage(oldTask, newTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.indexOf(oldTask);
    if (index !== -1) {
        tasks[index] = newTask;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromTable(task) {
    const rows = tasksTableBody.getElementsByTagName('tr');
    for (let row of rows) {
        if (row.cells[0].textContent.trim() === task) {
            row.remove();
            break;
        }
    }
}

function updateTaskInTable(oldTask, newTask) {
    const rows = tasksTableBody.getElementsByTagName('tr');
    for (let row of rows) {
        if (row.cells[0].textContent.trim() === oldTask) {
            row.cells[0].textContent = newTask;
            break;
        }
    }
}

function removeTaskFromList(task) {
    const items = todoList.getElementsByTagName('li');
    for (let item of items) {
        if (item.textContent.trim() === task) {
            item.remove();
            break;
        }
    }
}

function updateTaskInList(oldTask, newTask) {
    const items = todoList.getElementsByTagName('li');
    for (let item of items) {
        if (item.textContent.trim() === oldTask) {
            item.childNodes[0].nodeValue = newTask;
            break;
        }
    }
}
