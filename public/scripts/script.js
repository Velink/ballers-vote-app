const form = document.getElementById('reg-form');
form.addEventListener('submit', registerUser)

async function registerUser(event){
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        alert('success!')
    } else {
        alert(result.error);
    }

    console.log(result);
}

