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
    }
});

function deleteTaskFromLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
