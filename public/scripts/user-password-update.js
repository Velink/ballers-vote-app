const form = document.getElementById('update-password-form');
form.addEventListener('submit', updateUserPassword)

async function updateUserPassword(event){
    event.preventDefault();
    const password = document.getElementById('password').value;


    const urlString = window.location.href;
    const url = new URL(urlString);
    const token = url.searchParams.get("token");
    const userID = url.searchParams.get("id")
    console.log('we here token ' + token);

    // NEED TO MAKE SURE CONFIRM PASSWORD IS SAME PASSWORD AS A CHECK 
    const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/user-password-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userID,
            newpassword: password,
            token: token
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        let body = document.getElementById('body');
        console.log('password reset successfully')
        body.innerHTML = '';
        let userNotice = document.createElement('p');
        userNotice.setAttribute('id', 'user-notice');
        userNotice.setAttribute('class','styled-label');
        userNotice.textContent = 'Your password has been reset successfully!'

        let homeButton = document.createElement('button');
        homeButton.textContent = 'Home';
        homeButton.setAttribute('id', 'user-notice-button');
        homeButton.setAttribute('class', 'styled-button');
        homeButton.addEventListener('click', () => {
            window.location.replace('https://ballers-edmonton.netlify.app/')
        })

        body.appendChild(userNotice);
        body.appendChild(homeButton);
    } else {
        alert(result.error);
    }
}


