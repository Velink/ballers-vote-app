const form = document.getElementById('forgot-password-form');
form.addEventListener('submit', loginUser)

async function loginUser(event){
    event.preventDefault();
    const password = document.getElementById('password').value;

    const result = await fetch('http://localhost:3000/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newpassword: password,
            token: localStorage.getItem('token')
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        alert('success!')
    } else {
        alert(result.error);
    }
}

