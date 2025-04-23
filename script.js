const API_BASE_URL = 'http://4.231.122.88:5000';
if (window.location.pathname.endsWith('index.html')) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userId = localStorage.getItem('userId');
    if (!loggedInUser || !userId) {
        window.location.href = 'login.html';
    }
}
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
                console.log('Tasks loaded:', tasks); // Debug log
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    if (task.id && task.title) {
                        addTaskToDOM(task.title, task.completed, task.id);
                    }
                });
            } else {
                console.error('Failed to load tasks:', await response.text());
                alert('Failed to load tasks. Please refresh the page.');
            }
        } catch (err) {
            console.error('Error loading tasks:', err);
            //alert('Network error loading tasks. Please check your connection.');
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
            const newCompletedState = !li.classList.contains('completed');
            try {
                await updateTask(li.dataset.taskId, {
                    title: li.querySelector('.task-text').textContent,
                    completed: newCompletedState
                });
                li.classList.toggle('completed');
                checkbox.className = newCompletedState ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
            } catch (err) {
                console.error('Error updating task:', err);
                //alert('Failed to update task status');
            }
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
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    await deleteTask(li.dataset.taskId);
                    li.classList.add('removing');
                    setTimeout(() => {
                        li.remove();
                    }, 300);
                } catch (err) {
                    console.error('Error deleting task:', err);
                    //alert('Failed to delete task');
                }
            }
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
                try {
                    await updateTask(taskId, {
                        title: newText,
                        completed: li.classList.contains('completed')
                    });
                    taskTextElement.textContent = newText;
                    inputField.replaceWith(taskTextElement);
                    saveBtn.replaceWith(editBtn);
                    checkbox.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                } catch (err) {
                    console.error('Error updating task:', err);
                    //alert('Failed to update task');
                    inputField.replaceWith(taskTextElement);
                    saveBtn.replaceWith(editBtn);
                    checkbox.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                }
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: taskTitle, completed: false }),
            });

            if (response.ok) {
                const newTask = await response.json();
                addTaskToDOM(newTask.title, newTask.completed, newTask.id);
                return true;
            }
            throw new Error('Failed to create task');
        } catch (err) {
            console.error('Error creating task:', err);
            //alert('Failed to create task');
            return false;
        }
    }

    async function updateTask(taskId, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${userId}/tasks`, {  // Fixed endpoint
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: taskId,  // Include task ID in the body
                    title: taskData.title,
                    completed: taskData.completed
                }),
            });

            if (!response.ok) throw new Error('Failed to update task');
            return true;
        } catch (err) {
            console.error('Error updating task:', err);
            //alert('Failed to update task');
            return false;
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/user/${taskId}/task/${userId}`, {  // Fixed endpoint
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to delete task');
            return true;
        } catch (err) {
            console.error('Error deleting task:', err);
            //alert('Failed to delete task');
            return false;
        }
    }
    addTaskBtn.addEventListener('click', async function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            try {
                const taskId = await createTask(taskText);
                addTaskToDOM(taskText, false, taskId);
                taskInput.value = '';
            } catch (err) {
                console.error('Error adding task:', err);
            }
        }
    });
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });
    loadTasks();
});