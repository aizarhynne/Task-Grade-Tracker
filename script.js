document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tasksTableBody = document.querySelector('#tasks-table tbody');

    let todos = [];

    // Function to render the to-do list
    const renderTodos = () => {
        todoList.innerHTML = '';
        tasksTableBody.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            if (todo.completed) {
                li.classList.add('completed');
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTodo(index));

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTodoPrompt(index));

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            li.addEventListener('click', () => toggleComplete(index));

            todoList.appendChild(li);

            // Add the task to the table
            const row = tasksTableBody.insertRow();
            const taskCell = row.insertCell(0);
            taskCell.textContent = todo.text;
            taskCell.classList.add('task-cell');

            for (let i = 1; i <= 14; i++) {
                row.insertCell(i).contentEditable = true; // Week columns
            }
            
            const m1Cell = row.insertCell(15);
            m1Cell.contentEditable = true;
            m1Cell.classList.add('m1-cell');
            const m2Cell = row.insertCell(16);
            m2Cell.contentEditable = true;
            m2Cell.classList.add('m2-cell');
            const m3Cell = row.insertCell(17);
            m3Cell.contentEditable = true;
            m3Cell.classList.add('m3-cell');
            
            const finalGradeCell = row.insertCell(18);
            finalGradeCell.textContent = '';
            finalGradeCell.classList.add('final-grade-cell');

            // Add event listeners to recalculate the final grade when M1, M2, or M3 are edited
            [m1Cell, m2Cell, m3Cell].forEach(cell => {
                cell.addEventListener('input', () => calculateFinalGrade(row, finalGradeCell));
            });
        });
    };

    // Function to calculate the final grade
    const calculateFinalGrade = (row, finalGradeCell) => {
        const m1 = parseFloat(row.cells[15].textContent) || 0;
        const m2 = parseFloat(row.cells[16].textContent) || 0;
        const m3 = parseFloat(row.cells[17].textContent) || 0;

        let count = 0;
        let total = 0;

        if (m1) {
            total += m1;
            count++;
        }
        if (m2) {
            total += m2;
            count++;
        }
        if (m3) {
            total += m3;
            count++;
        }

        if (count > 0) {
            finalGradeCell.textContent = (total / count).toFixed(2);
        } else {
            finalGradeCell.textContent = '';
        }
    };

    // Function to add a new to-do item
    const addTodo = (event) => {
        event.preventDefault();

        const todoText = todoInput.value.trim();
        if (todoText === '') return;

        todos.push({ text: todoText, completed: false });
        todoInput.value = '';

        renderTodos();
    };

    // Function to toggle the completion status of a to-do item
    const toggleComplete = (index) => {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    };

    // Function to delete a to-do item
    const deleteTodo = (index) => {
        todos.splice(index, 1);
        renderTodos();
    };

    // Function to edit a to-do item
    const editTodoPrompt = (index) => {
        const newTodoText = prompt("Edit your task:", todos[index].text);
        if (newTodoText !== null && newTodoText.trim() !== '') {
            todos[index].text = newTodoText.trim();
            renderTodos();
        }
    };

    todoForm.addEventListener('submit', addTodo);
    renderTodos();
});
