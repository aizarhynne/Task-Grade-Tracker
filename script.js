// Get references to the DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const tasksTableBody = document.getElementById('tasks-table').getElementsByTagName('tbody')[0];

// Load tasks from local storage when the document is fully loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Save tasks to local storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasksData', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    console.log("Loading tasks from local storage...");
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    console.log("Loaded tasks:", tasksData);
    tasksData.forEach(taskData => {
        addTaskDataToDOM(taskData);
    });
}

// Add task data to DOM
function addTaskDataToDOM(taskData) {
    console.log("Adding task to DOM:", taskData);
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
    console.log("Task added to DOM");
}

// Save task data to local storage
function saveTaskDataToLocalStorage(taskData) {
    console.log("Saving task to local storage:", taskData);
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData.push(taskData);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    console.log("Task saved to local storage");
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
        addTaskDataToDOM(taskData);
        saveTaskDataToLocalStorage(taskData);
        todoInput.value = '';
        console.log("Task added:", task);
    } else {
        console.log("No task entered");
    }
});

// Event listener for delete and edit buttons
tasksTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.parentElement.parentElement;
        const task = row.dataset.task;
        deleteTaskFromLocalStorage(task);
        row.remove();
        console.log("Task deleted:", task);
    } else if (e.target.classList.contains('edit-btn')) {
        const row = e.target.parentElement.parentElement;
        const oldTask = row.dataset.task;
        const newTask = prompt("Edit your task:", oldTask);
        if (newTask) {
            editTaskInLocalStorage(oldTask, newTask);
            row.dataset.task = newTask;
            row.cells[0].textContent = newTask;
            console.log("Task edited from:", oldTask, "to:", newTask);
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
            console.log("Task updated from:", oldTask, "to:", newTask);
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
    console.log("Final grade calculated:", finalGradeCell.textContent);
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
    console.log("Task data updated and saved to local storage:", tasksData);
}

function deleteTaskFromLocalStorage(task) {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData = tasksData.filter(data => data.task !== task);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    console.log("Task deleted from local storage:", task);
}

function editTaskInLocalStorage(oldTask, newTask) {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    const index = tasksData.findIndex(data => data.task === oldTask);
    if (index !== -1) {
        tasksData[index].task = newTask;
    }
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    console.log("Task edited in local storage from:", oldTask, "to:", newTask);
}

// Load initial data
document.addEventListener('DOMContentLoaded', loadTasks);
