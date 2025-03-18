document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    const signupForm = document.querySelector(".signup-form");
    const todoApp = document.querySelector(".todo-app");
    const authContainer = document.getElementById("auth-container");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const showLoginBtn = document.getElementById("show-login");
    const showSignupBtn = document.getElementById("show-signup");
    const loginError = document.getElementById("login-error");
    const signupError = document.getElementById("signup-error");
    const userNameDisplay = document.getElementById("user-name");
    const welcomeMessage = document.getElementById("welcome-message");
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const loginTitle = document.getElementById("login-title");
    const signupTitle = document.getElementById("signup-title");
    const todoTitle = document.getElementById("todo-title");

    let tasks = [];

    function hideAllTitles() {
        loginTitle.style.display = "none";
        signupTitle.style.display = "none";
        todoTitle.style.display = "none";
    }

    function showLoginView() {
        hideAllTitles();
        loginTitle.style.display = "block";

        loginForm.style.display = "block";
        signupForm.style.display = "none";
        authContainer.style.display = "block";
        todoApp.style.display = "none";

        loginError.style.display = "none";
        signupError.style.display = "none";

        showLoginBtn.style.display = "block";
        showSignupBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }

    function showSignupView() {
        hideAllTitles();
        signupTitle.style.display = "block";

        signupForm.style.display = "block";
        loginForm.style.display = "none";
        authContainer.style.display = "block";
        todoApp.style.display = "none";

        loginError.style.display = "none";
        signupError.style.display = "none";

        showLoginBtn.style.display = "block";
        showSignupBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }

    function showTodoView() {
        hideAllTitles();
        todoTitle.style.display = "block";

        authContainer.style.display = "none";
        todoApp.style.display = "block";

        loginError.style.display = "none";
        signupError.style.display = "none";

        showLoginBtn.style.display = "none";
        showSignupBtn.style.display = "none";
        // Pokazujemy przycisk Logout
        logoutBtn.style.display = "block";
    }

    showLoginBtn.addEventListener("click", showLoginView);
    showSignupBtn.addEventListener("click", showSignupView);

    signupBtn.addEventListener("click", () => {
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        if (username && password) {
            localStorage.setItem("user", username);
            userNameDisplay.textContent = `Hello, ${username}`;
            welcomeMessage.style.display = "block";
            showTodoView();
            loadTasks();
        } else {
            signupError.style.display = "block";
        }
    });

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username && password) {
            localStorage.setItem("user", username);
            userNameDisplay.textContent = `Hello, ${username}`;
            welcomeMessage.style.display = "block";
            showTodoView();
            loadTasks();
        } else {
            loginError.style.display = "block";
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        welcomeMessage.style.display = "none";
        showSignupView();
    });

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("todo-item");

            const taskTextElem = document.createElement("span");
            taskTextElem.classList.add("text");
            if (task.completed) {
                taskTextElem.innerHTML = `<s>${task.text}</s>`;
            } else {
                taskTextElem.textContent = task.text;
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.innerHTML = task.completed
                ? '<i class="fa-solid fa-circle-check fa-lg"></i>'
                : '<i class="fa-regular fa-circle fa-lg"></i>';
            toggleBtn.classList.add("toggle-btn");
            toggleBtn.addEventListener("click", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            const editBtn = document.createElement("button");
            editBtn.innerHTML = '<i class="fa-solid fa-pencil fa-lg"></i>';
            editBtn.addEventListener("click", () => {
                taskTextElem.contentEditable = "true";
                taskTextElem.focus();
                editBtn.innerHTML = '<i class="fas fa-save fa-lg"></i>';

                editBtn.onclick = () => {
                    task.text = taskTextElem.textContent;
                    taskTextElem.contentEditable = "false";
                    editBtn.innerHTML = '<i class="fa-solid fa-pencil fa-lg"></i>';
                    saveTasks();
                    renderTasks();
                };
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = '<i class="fas fa-trash fa-lg"></i>';
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            li.appendChild(toggleBtn);
            li.appendChild(taskTextElem);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        renderTasks();
    }

    if (localStorage.getItem("user")) {
        userNameDisplay.textContent = `Hello, ${localStorage.getItem("user")}`;
        welcomeMessage.style.display = "block";
        showTodoView();
        loadTasks();
    } else {
        showSignupView();
    }
});
