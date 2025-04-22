const API_BASE_URL = 'http://4.231.122.88:5000';

if (window.location.pathname.endsWith('index.html')) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userId = localStorage.getItem('userId');
    if (!loggedInUser || !userId) {
        window.location.href = 'login.html';
    }
}

if (window.location.pathname.endsWith('login.html')) {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const myusername = document.getElementById('username').value;
        const mypassword = document.getElementById('password').value;

        try {
            const response = await fetch('http://4.231.122.88:5000/users/');
            const users = await response.json();

            const matchedUser = users.find(user => user.email === myusername && user.password === mypassword);
            if (matchedUser) {
                localStorage.setItem('loggedInUser', matchedUser.email);
                localStorage.setItem('userId', matchedUser.id);
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Please try again.');
        }
    });
}

if (window.location.pathname.endsWith('register.html')) {
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const myusername = document.getElementById('username').value;
        const mypassword = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/`);
            const users = await response.json();
            console.log(users);

            const matchedUser = users.find(user => user.email === myusername && user.password === mypassword);

            if (!matchedUser){
                const createResponse = await fetch(`http://4.231.122.88:5000/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: myusername,
                        password: mypassword,
                        tasks: [
                            {
                                id: "string",
                                title: "string",
                                completed: false
                            }]
                    }),
                }).then(res => {
                    console.log(response.json())
                }).catch(err => console.log(err));
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert('Username already exists');
                return;
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Registration failed. Please try again.');
        }

            // if (checkResponse.ok) {
            //     const users = await checkResponse.json();
            //     if (users.some(u => u.username === username)) {
            //         alert('Username already exists');
            //         return;
            //     }
            // } else {
            //     alert('Failed to check username availability');
            //     return;
            // }

            // Create new user
            // const createResponse = await fetch(`http://4.231.122.88:5000/users`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: username,
            //         password: password,
            //         tasks: [
            //     {
            //         id: "string",
            //         title: "string",
            //         completed: false
            //     }]
            //     }),
            // }).then(res => {
            //     console.log(response.json())
            // })
            //     .then(data => console.log(data))
            //     .catch(err => console.log(err));

            // if (createResponse.ok) {
            //     const newUser = await createResponse.json();
            //     alert('Registration successful! Please login.');
            //     window.location.href = 'login.html';
            // } else {
            //     const error = await createResponse.json();
            //     alert(error.message || 'Registration failed');
            // }

    });
}