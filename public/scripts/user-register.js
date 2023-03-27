const form = document.getElementById('reg-form');
form.addEventListener('submit', registerUser)

async function registerUser(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('http://localhost:3000/api/user-register', {
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
        alert('Thank you for registering - click ok to go to the login page!')

        setTimeout(function () {
            window.location.href = "http://localhost:5500/public/index.html"; 
         }, 1000); //will call the function after 2 secs.
    } else {
        alert(result.error);
    }

    console.log(result);
}

