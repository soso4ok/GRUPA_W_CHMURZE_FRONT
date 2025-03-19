document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }

    function addTaskToDOM(taskText, completed = false) {
        const li = document.createElement('li');
        if (completed) {
            li.classList.add('completed');
        }

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const checkbox = document.createElement('i');
        checkbox.className = completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('click', function () {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                checkbox.className = 'fa-solid fa-circle-check';
            } else {
                checkbox.className = 'fa-regular fa-circle';
            }
            saveTasks();
        });

        const taskTextElement = document.createElement('span');
        taskTextElement.classList.add('task-text');
        taskTextElement.textContent = taskText;

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        editBtn.classList.add('edit');
        editBtn.addEventListener('click', function () {
            const newText = prompt('Edit task:', taskText);
            if (newText !== null && newText.trim() !== '') {
                taskTextElement.textContent = newText.trim();
                saveTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.classList.add('delete');
        deleteBtn.addEventListener('click', function () {
            li.remove();
            saveTasks();
        });

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextElement);
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        li.appendChild(taskContent);
        li.appendChild(taskActions);
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#taskList li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTaskToDOM(taskText);
            taskInput.value = '';
            saveTasks();
        }
    });

    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    loadTasks();
});