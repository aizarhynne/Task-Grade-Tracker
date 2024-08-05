// Get references to the DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const tasksTableBody = document.getElementById('tasks-table').getElementsByTagName('tbody')[0];

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Save tasks to local storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Save task data to local storage
function saveTaskDataToLocalStorage(taskData) {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData.push(taskData);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

// Load task data from local storage
function loadTaskData() {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData.forEach(taskData => {
        addTaskDataToDOM(taskData);
    });
}

// Add task to DOM
function addTaskToDOM(task) {
    const row = tasksTableBody.insertRow();
    row.dataset.task = task; // Store the original task in the row's dataset
    row.innerHTML = `
        <td class="task-cell" contenteditable="true">${task}</td>
        ${Array.from({ length: 14 }, (_, i) => `<td contenteditable="true" class="week-cell week-${i + 1}-cell"></td>`).join('')}
        <td contenteditable="true" class="m1-cell"></td>
        <td contenteditable="true" class="m2-cell"></td>
        <td contenteditable="true" class="m3-cell"></td>
        <td class="final-grade-cell"></td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
}

// Add task data to DOM
function addTaskDataToDOM(taskData) {
    const row = tasksTableBody.insertRow();
    row.dataset.task = taskData.task;
    row.innerHTML = `
        <td class="task-cell" contenteditable="true">${taskData.task}</td>
        ${taskData.weeks.map((week, i) => `<td contenteditable="true" class="week-cell week-${i + 1}-cell">${week}</td>`).join('')}
        <td contenteditable="true" class="m1-cell">${taskData.m1}</td>
        <td contenteditable="true" class="m2-cell">${taskData.m2}</td>
        <td contenteditable="true" class="m3-cell">${taskData.m3}</td>
        <td class="final-grade-cell">${taskData.finalGrade}</td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
}

// Event listener for form submission
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
        const taskData = {
            task,
            weeks: Array(14).fill(''),
            m1: '',
            m2: '',
            m3: '',
            finalGrade: ''
        };
        addTaskToDOM(task);
        saveTaskDataToLocalStorage(taskData);
        todoInput.value = '';
    }
});

// Event listener for delete and edit buttons
tasksTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.parentElement.parentElement;
        const task = row.cells[0].textContent.trim();
        deleteTaskFromLocalStorage(task);
        row.remove();
    } else if (e.target.classList.contains('edit-btn')) {
        const row = e.target.parentElement.parentElement;
        const oldTask = row.dataset.task;
        const newTask = prompt("Edit your task:", oldTask);
        if (newTask) {
            editTaskInLocalStorage(oldTask, newTask);
            row.dataset.task = newTask;
            row.cells[0].textContent = newTask;
        }
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
    } else if (e.target.classList.contains('week-cell') || e.target.classList.contains('m1-cell') || e.target.classList.contains('m2-cell') || e.target.classList.contains('m3-cell')) {
        const row = e.target.parentElement;
        calculateFinalGrade(row);
        saveUpdatedTaskDataToLocalStorage(row);
    }
});

// Calculate final grade
function calculateFinalGrade(row) {
    const m1 = parseFloat(row.querySelector('.m1-cell').textContent) || 0;
    const m2 = parseFloat(row.querySelector('.m2-cell').textContent) || 0;
    const m3 = parseFloat(row.querySelector('.m3-cell').textContent) || 0;
    const finalGradeCell = row.querySelector('.final-grade-cell');

    const grades = [m1, m2, m3].filter(grade => grade > 0);
    const numberOfGrades = grades.length;

    if (numberOfGrades > 0) {
        const finalGrade = grades.reduce((sum, grade) => sum + grade, 0) / numberOfGrades;
        finalGradeCell.textContent = finalGrade.toFixed(2);
    } else {
        finalGradeCell.textContent = '';
    }
}

// Save updated task data to local storage
function saveUpdatedTaskDataToLocalStorage(row) {
    const task = row.dataset.task;
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    const index = tasksData.findIndex(data => data.task === task);

    if (index !== -1) {
        tasksData[index] = {
            task,
            weeks: Array.from(row.querySelectorAll('.week-cell')).map(cell => cell.textContent),
            m1: row.querySelector('.m1-cell').textContent,
            m2: row.querySelector('.m2-cell').textContent,
            m3: row.querySelector('.m3-cell').textContent,
            finalGrade: row.querySelector('.final-grade-cell').textContent
        };
    } else {
        tasksData.push({
            task,
            weeks: Array.from(row.querySelectorAll('.week-cell')).map(cell => cell.textContent),
            m1: row.querySelector('.m1-cell').textContent,
            m2: row.querySelector('.m2-cell').textContent,
            m3: row.querySelector('.m3-cell').textContent,
            finalGrade: row.querySelector('.final-grade-cell').textContent
        });
    }

    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

function deleteTaskFromLocalStorage(task) {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData = tasksData.filter(data => data.task !== task);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

function editTaskInLocalStorage(oldTask, newTask) {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    const index = tasksData.findIndex(data => data.task === oldTask);
    if (index !== -1) {
        tasksData[index].task = newTask;
    }
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

// Load initial data
document.addEventListener('DOMContentLoaded', loadTaskData);
