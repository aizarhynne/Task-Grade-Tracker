// Get references to the DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
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
    const row = tasksTableBody.insertRow();
    row.dataset.task = task; // Store the original task in the row's dataset
    row.innerHTML = `
        <td class="task-cell" contenteditable="true">${task}</td>
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

// Event listener for delete buttons in the table
tasksTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.parentElement.parentElement;
        const task = row.cells[0].textContent.trim();
        deleteTaskFromLocalStorage(task);
        row.remove();
    }
});

// Event listener for editable task cells in the table
tasksTableBody.addEventListener('input', function(e) {
    if (e.target.classList.contains('task-cell')) {
        const row = e.target.parentElement;
        const oldTask = row.dataset.task;
        const newTask = e.target.textContent.trim();
        if (oldTask && newTask) {
            editTaskInLocalStorage(oldTask, newTask);
            row.dataset.task = newTask;
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
