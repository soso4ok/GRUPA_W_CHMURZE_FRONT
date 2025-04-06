document.addEventListener('DOMContentLoaded', function () {
    const authButtons = document.getElementById('auth-buttons');
    const userGreeting = document.getElementById('user-greeting');
    const helloButton = document.getElementById('hello-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutButton = document.getElementById('logout-button');

    function updateHeader() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            authButtons.style.display = 'none';
            userGreeting.style.display = 'block';
            helloButton.textContent = `Hello, ${loggedInUser}`;
        } else {
            authButtons.style.display = 'flex';
            userGreeting.style.display = 'none';
        }
    }

    helloButton.addEventListener('click', function () {
        dropdownMenu.classList.toggle('open');
    });

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    updateHeader();

    document.addEventListener('click', function (event) {
        if (!userGreeting.contains(event.target)) {
            dropdownMenu.classList.remove('open');
        }
    });

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
            enableEditMode(taskTextElement, li, checkbox, deleteBtn);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.classList.add('delete');
        deleteBtn.addEventListener('click', function () {
            li.classList.add('removing');
            setTimeout(() => {
            li.remove();
            saveTasks();
            }, 300);
        });

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextElement);
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        li.appendChild(taskContent);
        li.appendChild(taskActions);
        taskList.appendChild(li);
    }

    function enableEditMode(taskTextElement, li, checkbox, deleteBtn) {
        const originalText = taskTextElement.textContent;

        checkbox.style.display = 'none';
        deleteBtn.style.display = 'none';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = originalText;
        inputField.classList.add('edit-input');

        taskTextElement.replaceWith(inputField);
        inputField.focus();

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('save');

        const editBtn = li.querySelector('.edit');
        editBtn.replaceWith(saveBtn);

        saveBtn.addEventListener('click', function () {
            const newText = inputField.value.trim();
            if (newText !== '') {
                taskTextElement.textContent = newText;
                inputField.replaceWith(taskTextElement);
                saveBtn.replaceWith(editBtn);
                checkbox.style.display = 'inline-block';
                deleteBtn.style.display = 'inline-block';
                saveTasks();
            }
        });

        inputField.addEventListener('keyup', function (e) {
            if (e.key === 'Escape') {
                inputField.replaceWith(taskTextElement);
                saveBtn.replaceWith(editBtn);
                checkbox.style.display = 'inline-block';
                deleteBtn.style.display = 'inline-block';
            }
        });
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
