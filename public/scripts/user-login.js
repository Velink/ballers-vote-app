const form = document.getElementById('user-login-form');
form.addEventListener('submit', loginUser)

async function fillFields(){
    console.log('THIS IS IT BABY')
    let userInput = document.getElementById('username');
    userInput.value = localStorage.getItem("username");
    let passInput = document.getElementById('password');
    passInput.value = localStorage.getItem("password");
}

fillFields()

async function loginUser(event){
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/user-login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        localStorage.setItem('token', result.data);
        localStorage.setItem('username', username)
        console.log(result.data)
        console.log('WHY IS THIS NOT HAPPENING ANYMORE')
        generatePollPage()
        // Direct to enter password to vote page 
        // CALL A FUNCTION THAT GENERATES THE poll.html PAGE 
    
    } else {
        alert(result.error);
    }
}


const main = document.getElementById('main');
const body = document.getElementById('body');
function generatePollPage(){

    window.location.hash = '#dashboard'
    body.innerHTML = '';

    // APPEND SCRIPT TO HEAD
    const head = document.getElementById('head');
    const tableScript = document.createElement('script');
    tableScript.setAttribute('src', './scripts/enterPoll.js');
    head.appendChild(tableScript);

    // APPEND CSS FILE TO HEAD
    const cssFile = document.createElement('link');
    cssFile.setAttribute('href', './style.css');
    cssFile.setAttribute('rel', 'stylesheet');
    head.appendChild(cssFile);

    // INTRO TITLE

    const introTitle = document.createElement('h2');
    introTitle.setAttribute('class', 'landing-page-title');
    introTitle.textContent = 'Welcome to the Ballers Poll';

    // PASSWORD FIELD AND SUBMIT BUTTON

    const gatesContainer = document.createElement('div');
    gatesContainer.setAttribute('class', 'gates-container');

    const gatesTitle = document.createElement('p');
    gatesTitle.setAttribute('class', 'gates-title');
    gatesTitle.textContent = 'Enter this week\'s password to vote';

    const gatesPassword = document.createElement('input');
    gatesPassword.setAttribute('id', 'gates-password');
    gatesPassword.setAttribute('class', 'styled-input');
    gatesPassword.setAttribute('type', 'password');

    const gatesOpen = document.createElement('input');
    gatesOpen.setAttribute('class', 'styled-button');
    gatesOpen.setAttribute('id', 'gates-open');
    gatesOpen.setAttribute('type', 'submit');
    gatesOpen.setAttribute('text', 'submit');

    gatesContainer.appendChild(gatesTitle);
    gatesContainer.appendChild(gatesPassword);
    gatesContainer.appendChild(gatesOpen);

    const ratingButtonContainer = document.createElement('div');
    ratingButtonContainer.setAttribute('class', 'rating-button-container');

    // Weekly Ratings Button
    const weeklyRatingsButton = document.createElement('button');
    weeklyRatingsButton.setAttribute('class', 'styled-button');
    weeklyRatingsButton.setAttribute('id', 'weekly-button');
    weeklyRatingsButton.textContent = 'See this week\'s ratings';

    // Overall Ratings Button 
    const overallRatingsButton = document.createElement('button');
    overallRatingsButton.setAttribute('class', 'styled-button');
    overallRatingsButton.setAttribute('id', 'overall-button');
    overallRatingsButton.textContent = 'Order by all time rating';

    // Order by Wins Button 
    const orderWinsButton = document.createElement('button');
    orderWinsButton.setAttribute('class', 'styled-button');
    orderWinsButton.setAttribute('id', 'order-wins');
    orderWinsButton.textContent = 'Order by wins';

    // Order by losses Button 
    const orderLossesButton = document.createElement('button');
    orderLossesButton.setAttribute('class', 'styled-button');
    orderLossesButton.setAttribute('id', 'order-losses');
    orderLossesButton.textContent = 'Order by defeats';

    ratingButtonContainer.appendChild(weeklyRatingsButton);
    ratingButtonContainer.appendChild(overallRatingsButton);
    ratingButtonContainer.appendChild(orderWinsButton);
    ratingButtonContainer.appendChild(orderLossesButton);

    const main = document.createElement('main');
    main.setAttribute('id', 'main');
    main.appendChild(introTitle);
    main.appendChild(gatesContainer);
    main.appendChild(ratingButtonContainer);

    const tableContainer = document.createElement('section');
    tableContainer.setAttribute('id', 'table-container');
    
    // Weekly Ratings Table

    const weeklyTableTitle = document.createElement('h2');
    weeklyTableTitle.setAttribute('class', 'weekly-ratings-table-title');
    weeklyTableTitle.textContent = 'Weekly Ratings Table';

    const weeklyRatingsTable = document.createElement('table');
    weeklyRatingsTable.setAttribute('id', 'weekly-ratings-table');

    weeklyTableTitle.appendChild(weeklyRatingsTable);

    // Overall Ratings Table

    const overallTableTitle = document.createElement('h2');
    overallTableTitle.setAttribute('class', 'overall-ratings-table-title');
    overallTableTitle.textContent = 'Overall Ratings Table';

    const overallRatingsTable = document.createElement('table');
    overallRatingsTable.setAttribute('id', 'overall-ratings-table');

    overallTableTitle.appendChild(overallRatingsTable);

    tableContainer.appendChild(weeklyTableTitle);
    tableContainer.appendChild(overallTableTitle);

    body.appendChild(main);
    body.appendChild(tableContainer);
}

function getRand(){
    return new Date().getTime().toString() + Math.floor(Math.random()*1000000);
}