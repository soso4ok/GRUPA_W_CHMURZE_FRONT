const API_BASE_URL = 'http://4.231.122.88:5000';

document.addEventListener('DOMContentLoaded', function () {
    const authButtons = document.getElementById('auth-buttons');
    const userGreeting = document.getElementById('user-greeting');
    const helloButton = document.getElementById('hello-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutButton = document.getElementById('logout-button');
    const userId = localStorage.getItem('userId');

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
        localStorage.removeItem('userId');
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

    async function loadTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/user/${userId}`);
            if (response.ok) {
                const tasks = await response.json();
                // Clear existing tasks
                taskList.innerHTML = '';
                // Add each task to DOM
                tasks.forEach(task => addTaskToDOM(task.title, task.completed, task.id));
            } else {
                console.error('Failed to load tasks');
            }
        } catch (err) {
            console.error('Error loading tasks:', err);
        }
    }

    function addTaskToDOM(taskTitle, completed = false, taskId = null) {
        const li = document.createElement('li');
        if (completed) {
            li.classList.add('completed');
        }
        if (taskId) {
            li.dataset.taskId = taskId;
        }

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const checkbox = document.createElement('i');
        checkbox.className = completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('click', async function () {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                checkbox.className = 'fa-solid fa-circle-check';
            } else {
                checkbox.className = 'fa-regular fa-circle';
            }
            await updateTask(li.dataset.taskId, {
                title: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });

        const taskTextElement = document.createElement('span');
        taskTextElement.classList.add('task-text');
        taskTextElement.textContent = taskTitle;

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
        deleteBtn.addEventListener('click', async function () {
            li.classList.add('removing');
            setTimeout(async () => {
                await deleteTask(li.dataset.taskId);
                li.remove();
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
        const taskId = li.dataset.taskId;

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

        saveBtn.addEventListener('click', async function () {
            const newText = inputField.value.trim();
            if (newText !== '') {
                taskTextElement.textContent = newText;
                inputField.replaceWith(taskTextElement);
                saveBtn.replaceWith(editBtn);
                checkbox.style.display = 'inline-block';
                deleteBtn.style.display = 'inline-block';

                await updateTask(taskId, {
                    title: newText,
                    completed: li.classList.contains('completed')
                });
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

    async function createTask(taskTitle) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskTitle,
                    completed: false
                }),
            });

            if (response.ok) {
                const task = await response.json();
                return task.id; // Return the task ID for future updates
            } else {
                console.error('Failed to create task');
                return null;
            }
        } catch (err) {
            console.error('Error creating task:', err);
            return null;
        }
    }

    async function updateTask(taskId, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${userId}/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskData,
                    id: taskId
                }),
            });

            if (!response.ok) {
                console.error('Failed to update task');
            }
        } catch (err) {
            console.error('Error updating task:', err);
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/user/${taskId}/task/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error('Failed to delete task');
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    }

    addTaskBtn.addEventListener('click', async function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskId = await createTask(taskText);
            if (taskId) {
                addTaskToDOM(taskText, false, taskId);
                taskInput.value = '';
            }
        }
    });

    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Load tasks when page loads
    loadTasks();
});