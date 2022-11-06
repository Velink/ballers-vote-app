const form = document.getElementById('login-form');
form.addEventListener('submit', loginUser)

async function loginUser(event){
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/login', {
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
        localStorage.setItem('token', result.data)
        console.log(result.data)
        generateAdminDashboard();
    
    } else {
        alert(result.error);
    }
}


const main = document.getElementById('main');
const body = document.getElementById('body');
function generateAdminDashboard(){

    window.location.hash = '#dashboard'
    main.innerHTML = '';

    const header = document.createElement('header');
    const introTitle = document.createElement('h1');
    introTitle.textContent = 'Welcome to Ballers Admin Dashboard';
    header.appendChild(introTitle);
    body.appendChild(header);

    const labelInputPlayer = document.createElement('label');
    labelInputPlayer.setAttribute('for', 'name');
    labelInputPlayer.setAttribute('text', 'Enter player name: ');
    labelInputPlayer.textContent = 'Enter player name'
    body.appendChild(labelInputPlayer);

    const inputPlayer = document.createElement('input');
    inputPlayer.setAttribute('type', 'text');
    inputPlayer.setAttribute('name', 'name')
    body.appendChild(inputPlayer);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add player'
    body.appendChild(addButton);

    const setPassword = document.createElement('label');
    setPassword.setAttribute('text', 'Set password for this week');
    setPassword.setAttribute('for', 'password')
    body.appendChild(setPassword);

    const inputPassword = document.createElement('input');
    inputPassword.setAttribute('type', 'text');
    inputPassword.setAttribute('name', 'password');
    inputPassword.setAttribute('placeholder', 'Set password for this week!')
    body.appendChild(inputPassword);

    const playerList = document.createElement('ol')
    playerList.setAttribute('type', '1');
    body.appendChild(playerList);

    let playerArray = [];

    addButton.addEventListener('click', () => {
        playerArray.push(inputPlayer.value);
        console.log(playerArray);
        console.log(inputPlayer.value);
        let newItem = document.createElement('li');
        newItem.textContent = inputPlayer.value;
        playerList.appendChild(newItem);
    })

    const createButton = document.createElement('button');
    createButton.textContent = 'Create';
    body.appendChild(createButton); 

    createButton.addEventListener('click', async () => {
        let passwordPack = inputPassword.value;
        console.log(passwordPack)
        console.log(playerArray);
        const options = {
            method: 'POST',
            body: JSON.stringify({array: playerArray, password: passwordPack}),
            headers: {
                "Content-Type" : "application/json",
            },
        }

        // generateLobbyPage();
        const response = await fetch('https://ballers-vote-app-server.herokuapp.com/api/create', options)
        .then((res) => res.json())
        if(response.status === 'ok'){
            alert('success!')
            // generateLobbyPage()
        } else {
            alert(response.error);
        }
            console.log(response);
        })
    // On Click Fetch request is made to server and array of player names gets stored as schemas in the DB
    // Takes us to next 'page' which has the link for the poll - this page can also show how many people have voted
}

// We need to generate a unique ID for the voting room - this will be in the link we share - this ID is made at CREATE GAME
// at CREATE GAME - we have the player names array both on the frontend and the backend
// On Clicking the link a user receives the player name array that matches that room ID 
// THIS ARRAY GENERATES the voting page / fields - when the user clicks submit the score is updated in the database
// After 14 votes - 'Thank you for voting - TWO BUTTONS - SEE THIS WEEKS RATINGS - SEE ALL TIME RATINGS' 

// function generateLobbyPage(){
//     console.log('we are in here')
//     try {
//         let lobbyTitle =  document.createElement('h2');
//         lobbyTitle.textContent = 'Your game week poll has been created - share this link with each player so they can vote'
//         console.log(lobbyTitle)
//         let randomNumber = getRand()
//         let pollLink = document.createElement('h2');
//         pollLink.textContent = 'www.localhost:5500/public/poll/' + randomNumber;
//     body.appendChild(lobbyTitle);    
//     body.appendChild(pollLink);
//     } catch (error) {
//         console.log(error)
//     }
// }

function getRand(){
    return new Date().getTime().toString() + Math.floor(Math.random()*1000000);
}