const form = document.getElementById('reg-form');
form.addEventListener('submit', registerUser)

async function registerUser(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/user-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            username,
            password
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('Thank you for registering - click ok to go to the login page!')

        setTimeout(function () {
            window.location.href = "https://ballers-vote-app-server.herokuapp.com/index.html"; 
         }, 1000); //will call the function after 2 secs.
    } else {
        alert(result.error);
    }

    console.log(result);
}

