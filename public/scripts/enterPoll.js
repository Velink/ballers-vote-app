// CLIENT ENTERS PASSWORD TO START VOTING 

let submitButton = document.getElementById('gates-open');

submitButton.addEventListener('click', async () => {
    let enteredPassword = document.getElementById('gates-password').value;
    if(enteredPassword == null || enteredPassword == undefined){
        alert('please enter a password!')
    } else {
        const result = await fetch('https://ballers-vote-app-server.herokuapp.com/api/entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                enteredPassword
            })
        }).then((res) => res.json())
        if(result.status === 'ok'){
            window.location.hash = enteredPassword;
            console.log(window.location.hash.substring(1));
            console.log(result);
            beginPoll(result.result.rows);
        } else if(result.status === 'Error14'){
            alert('14 players have already voted this week!')
        }
        else {
            console.log(result);
            alert('Incorrect password, please try again!')
        }
  
    }
})

// ENTER VOTING

function beginPoll(rows){
    console.log('we have the rows here', rows);
    const main = document.getElementById('main');

    let overallRatingsTable = document.getElementById('overall-ratings-table');
    let weeklyRatingsTable = document.getElementById('weekly-ratings-table');

    let weeklyRatingsTitle = document.getElementsByClassName('weekly-ratings-table-title')[0];
    let overallRatingsTitle = document.getElementsByClassName('overall-ratings-table-title')[0];

    main.innerHTML = '';
    overallRatingsTable.innerHTML = '';
    weeklyRatingsTable.innerHTML = '';
    overallRatingsTitle.classList.remove('show');
    weeklyRatingsTitle.classList.remove('show');

    let str = `<h1 id="rating-inputs-title"> Please rate each player's performance out of 10 (1 d.p.)</h2>`;
    for (let i = 0; i < rows.length; i++) {
        str = str  + `<div class="rating-container">
                        <label class="rating-label" for="rating-${i}">${rows[i].name}</label>
                        <input class="rating-input" type="text" name="rating-1" id="rating-${i}" autocomplete="off">
                     </div>`
    }
    // The above comment needs to be sorted out first for authentication reasons
    // On clicking submit: 
    // 1. We have a form check to make sure all values are in 
    // 2. We take all the values and send an object array which has a name, password, and rating to it - DONE
    // 3. The server uses the password to match the game week, the name to match the player, and the rating to input their rating for that week.
    // 4. If all inputs are fine, the form is removed - a thank you for voting message comes up with this week's scores as well as a message 
    str = str + `<button class="styled-button" id="send-votes">Submit</button>`
    main.insertAdjacentHTML('beforeend', str);
    
    // const sendButton = document.createElement('button');
    // sendButton.setAttribute('id', 'send-votes');
    // main.appendChild(sendButton);

    const sendButton = document.getElementById('send-votes');
    console.log(sendButton);
    sendButton.addEventListener('click', async () => {
        console.log('do we have them here???' , rows);
        let passwordHash = window.location.hash.substring(1);
        console.log(passwordHash);
        let ratingObjectArray = [];
        for (let i = 0; i < rows.length; i++) {
            let rating = document.getElementById(`rating-${i}`).value;
            if(rating[rating.length - 1] == '.'){
                rating = rating.concat('0');
                console.log('CONCAT', rating)
                let object = { name: rows[i].name, password: passwordHash, rating: rating }
                ratingObjectArray.push(object) 
            } else {
                let object = { name: rows[i].name, password: passwordHash, rating: rating }
                ratingObjectArray.push(object) 
            }
        }
        console.log(ratingObjectArray);

        // Loop through ratingObjectArray and check whether any of the ratings are parseFloat() == NaN or undefined
        // If thats the case alert sort out input values otherwise run fetch 
        for (let x = 0; x < ratingObjectArray.length; x++) {
            console.log(ratingObjectArray[x].rating);
            console.log(parseFloat(ratingObjectArray[x].rating))
            const onlyNumbersRegExp = /^\d+(\.\d+)?$/;
            if(onlyNumbersRegExp.test(ratingObjectArray[x].rating) == false || ratingObjectArray[x].rating == undefined || ratingObjectArray[x].rating == '' || ratingObjectArray[x].rating > 10 || ratingObjectArray[x].rating < 0){
                console.log('VALUE:', ratingObjectArray[x])
                // If value is inputted as 5. then concatenate 0 at the end of it and parseFloat 
                alert('Please check your ratings and make sure they are all numbers between 0 and 10 (1 d.p.)');
                break;
            } else {
                // This condition here is to make sure that we are on the last input before creating the next page, this means all input values would have been checked
                if(x == ratingObjectArray.length -1){
                    console.log('this RAN');
                    const result = await fetch(`https://ballers-vote-app-server.herokuapp.com/api/rate/${passwordHash}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            array: ratingObjectArray
                        })
                    }).then((res) => res.json())
                    if(result.status === 'ok'){
                        generateThankYouPage(passwordHash);
                        console.log(result);
                    } else {
                        alert('There was an error with the server!')
                    }
                }
            }
            
        }
        // Check if results were stored fine if yes call function to generate thank you page with see current standings see all time standings 
    })
}

function generateThankYouPage(passwordHash){
    const password = passwordHash;
    console.log(password);
    const main = document.getElementById('main');
    main.innerHTML = '';

    const thanksTitle = document.createElement('h1');
    thanksTitle.textContent = 'Management thanks you for rating the Ballers this week!';
    thanksTitle.setAttribute('class', 'thanks-title');
    main.appendChild(thanksTitle);

    // THIS WEEK ON THANK YOU PAGE
    // This button needs to make a fetch request and get based on password the 14 average ratings - where do we calculate the average - on the backend 
    // This will display each player's name and their average score for the week based on votes 
    const seeWeekButton = document.createElement('button');
    seeWeekButton.setAttribute('class', 'styled-button')
    main.appendChild(seeWeekButton);
    seeWeekButton.textContent = "See this week's ratings";
    seeWeekButton.addEventListener('click', async () => {
        console.log(password);

        // CLEANUP TO AVOID TABLE STACKING 
        // Remove overall table from view
        let overallRatingsTitle = document.getElementsByClassName('overall-ratings-table-title')[0];
        overallRatingsTitle.classList.remove('show');
        let overallRatingsTable = document.getElementById('overall-ratings-table');
        overallRatingsTable.classList.remove('show');
        overallRatingsTable.innerHTML = '';

        // Show weekly table 
        let weeklyRatingsTitle = document.getElementsByClassName('weekly-ratings-table-title')[0];
        weeklyRatingsTitle.classList.add('show');
        let weeklyRatingsTable = document.getElementById('weekly-ratings-table');
        weeklyRatingsTable.classList.add('show');
        weeklyRatingsTable.innerHTML = '';

        const result = await fetch(`https://ballers-vote-app-server.herokuapp.com/api/weekly/${password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json())
        if(result.status === 'ok'){
            // generateLeaderboard(result);
            let weeklyRatingArray = result.result.rows;
            console.log(weeklyRatingArray);
            let table = document.getElementById('weekly-ratings-table');
            let str = `<tr>
                            <th>Name</th>
                            <th>Rating</th>
                       </tr>`;
                       let weeklyOrderedRatingArray = [];
                       for (let k = 0; k < weeklyRatingArray.length; k++) {
                           const displayRating = weeklyRatingArray[k].row.slice(
                               weeklyRatingArray[k].row.indexOf(',') + 1,
                               weeklyRatingArray[k].row.lastIndexOf(')'),
                             );
                           
                           const displayName = weeklyRatingArray[k].row.slice(
                               weeklyRatingArray[k].row.indexOf('"') + 1,
                               weeklyRatingArray[k].row.lastIndexOf('"'),
                           );
               
                             weeklyOrderedRatingArray[k] = { name: displayName, rating: parseFloat(displayRating)};
                             console.log(weeklyOrderedRatingArray[k]);    
                       }
                       // console.log('ordered ARRAY', weeklyOrderedRatingArray);
                       // weeklyOrderedRatingArray.sort(function(a, b) {return b-a});
                       // console.log('ordered ARRAY INCREASING', weeklyOrderedRatingArray);
                       weeklyOrderedRatingArray.sort(function(a, b){
                           return b.rating - a.rating;
                       });
                       console.log('ORDERED ???', weeklyOrderedRatingArray)
                       for (let i = 0; i < weeklyRatingArray.length; i++) {
                           // const displayOrderedRating = weeklyOrderedRatingArray[i];
                           // console.log('IS THIS WHAT I WANT', weeklyOrderedRatingArray);    
                           console.log('display name: ', weeklyOrderedRatingArray[i].name);
                           console.log('display rating:', weeklyOrderedRatingArray[i].rating);
                           str = str  + `
                                           <tr>
                                               <td>${weeklyOrderedRatingArray[i].name}</td>
                                               <td>${weeklyOrderedRatingArray[i].rating}</td>
                                           </tr>
                                        `
                       }
            table.insertAdjacentHTML('beforeend', str);
        } else {
            alert('There was an error with the server!')
        }
    })

    // This button needs to make a fetch request and get all scores for a given player's name - that is the average of all week averages
    // What I could do is add an average score column to the table - BUT THAT IS POPULATED WITH THE CLICK OF THE ABOVE BUTTON because that is where we calculate weekly average for each player anyway 
    
    // ON LOGIN WE CHECK IF A ROW WITH THAT PASSWORD HAS 14 RATINGS IF IT DOES - we display to the USER "Sorry 14 people already voted for this game week"
    // OVERALL ON THANK YOU PAGE
    const seeOverallButton = document.createElement('button');
    seeOverallButton.textContent = "See overall ratings";
    seeOverallButton.setAttribute('class', 'styled-button');

    seeOverallButton.addEventListener('click', async () => {
        generateLeaderboard();
    })

    // Return to home button
    const homeButton = document.createElement('a');
    homeButton.textContent = "Home";
    homeButton.setAttribute('class', 'styled-button')
    homeButton.setAttribute('href', 'https://ballers-edmonton.netlify.app/')

    main.appendChild(seeWeekButton);
    main.appendChild(seeOverallButton);
    main.appendChild(homeButton);
}


// SEE THIS WEEKS RATINGS HOME PAGE 
let weeklyRatingButton = document.getElementById('weekly-button');
weeklyRatingButton.addEventListener('click', async () => {
    // Remove overall table from view
    let overallRatingsTitle = document.getElementsByClassName('overall-ratings-table-title')[0];
    overallRatingsTitle.classList.remove('show');
    let overallRatingsTable = document.getElementById('overall-ratings-table');
    overallRatingsTable.classList.remove('show');
    overallRatingsTable.innerHTML = '';

    // Show number of people who voted
    let voteNumber = document.createElement('p');
    voteNumber.textContent = 'No. of Votes:';
    voteNumber.setAttribute('id', 'vote-number');

    // Show weekly table 
    let weeklyRatingsTitle = document.getElementsByClassName('weekly-ratings-table-title')[0];
    weeklyRatingsTitle.classList.add('show');
    let weeklyRatingsTable = document.getElementById('weekly-ratings-table');
    weeklyRatingsTable.classList.add('show');
    weeklyRatingsTable.innerHTML = '';


    const result = await fetch(`https://ballers-vote-app-server.herokuapp.com/api/home/weekly`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json())
    if(result.status === 'ok'){
        console.log(result); 
        console.log(result.result);           
        let weeklyRatingArray = result.result;
        let table = document.getElementById('weekly-ratings-table');
        table.appendChild(voteNumber);
        let str = `<tr>
                        <th>Name</th>
                        <th>Rating</th>
                   </tr>`;
        let weeklyOrderedRatingArray = [];
        for (let k = 0; k < weeklyRatingArray.length; k++) {
            const displayRating = weeklyRatingArray[k].row.slice(
                weeklyRatingArray[k].row.indexOf(',') + 1,
                weeklyRatingArray[k].row.lastIndexOf(')'),
              );
            
            const displayName = weeklyRatingArray[k].row.slice(
                weeklyRatingArray[k].row.indexOf('"') + 1,
                weeklyRatingArray[k].row.lastIndexOf('"'),
            );

              weeklyOrderedRatingArray[k] = { name: displayName, rating: parseFloat(displayRating)};
              console.log(weeklyOrderedRatingArray[k]);    
        }
        // console.log('ordered ARRAY', weeklyOrderedRatingArray);
        // weeklyOrderedRatingArray.sort(function(a, b) {return b-a});
        // console.log('ordered ARRAY INCREASING', weeklyOrderedRatingArray);
        weeklyOrderedRatingArray.sort(function(a, b){
            return b.rating - a.rating;
        });
        console.log('ORDERED ???', weeklyOrderedRatingArray)
        for (let i = 0; i < weeklyRatingArray.length; i++) {
            // const displayOrderedRating = weeklyOrderedRatingArray[i];
            // console.log('IS THIS WHAT I WANT', weeklyOrderedRatingArray);    
            console.log('display name: ', weeklyOrderedRatingArray[i].name);
            console.log('display rating:', weeklyOrderedRatingArray[i].rating);
            str = str  + `
                            <tr>
                                <td>${weeklyOrderedRatingArray[i].name}</td>
                                <td>${weeklyOrderedRatingArray[i].rating}</td>
                            </tr>
                         `
        }
        voteNumber.textContent = `No. of Votes: ${result.votes}`;
        table.insertAdjacentHTML('beforeend', str);
    } else {
        alert('There was an error with the server!')
    }
})

// SEE THIS OVERALL RATINGS HOME PAGE
let overallRatingButton = document.getElementById('overall-button');
overallRatingButton.addEventListener('click', async () => {
    generateLeaderboard();
})

// GEBERATE LEADERBOARD FUNCTION 
async function generateLeaderboard(){

    // Remove weekly table from view
    let weeklyRatingsTitle = document.getElementsByClassName('weekly-ratings-table-title')[0];
    weeklyRatingsTitle.classList.remove('show');
    let weeklyRatingsTable = document.getElementById('weekly-ratings-table');
    weeklyRatingsTable.classList.remove('show');
    weeklyRatingsTable.innerHTML = '';

    // Show overall Table 
    let overallRatingsTitle = document.getElementsByClassName('overall-ratings-table-title')[0];
    overallRatingsTitle.classList.add('show');
    let overallRatingsTable = document.getElementById('overall-ratings-table');
    overallRatingsTable.classList.add('show');
    overallRatingsTable.innerHTML = '';

    // Fetch Overall ratings 
    const result = await fetch(`https://ballers-vote-app-server.herokuapp.com/api/leaderboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json())
    if(result.status === 'ok'){
        // generateLeaderboard(result);
        console.log('WTF')
        console.log(result);
        console.log(result.array);            
    
        let overallRatingArray = result.array;
        let table = document.getElementById('overall-ratings-table');
        let str = ` <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>MP</th>
                    </tr>`;

        // Sort in descending order straight away using the overall_rating value in the player object
        overallRatingArray.sort(function(a, b){
            return b.overall_rating - a.overall_rating;
        });
        console.log('NEW METHOD', overallRatingArray);

        // let orderedOverallRatingArray = [];
        // for (let k = 0; k < overallRatingArray.length; k++) {
        //     try {
        //         console.log('hello WORLD', overallRatingArray[k].overall_rating)
        //         orderedOverallRatingArray[k] = parseFloat(overallRatingArray[k].overall_rating)
        //         console.log('what HERE', orderedOverallRatingArray[k])   
        //     } catch (error) {
        //         console.log('ERROR', error)
        //     }
        // }

        // console.log('BEFORE ORDERED', orderedOverallRatingArray)
        // orderedOverallRatingArray.sort(function(a, b) {return b-a});
        // console.log('overall ORDERED', orderedOverallRatingArray);

        for (let i = 0; i < overallRatingArray.length; i++) {
            const displayName = overallRatingArray[i].name;
            const displayRating = overallRatingArray[i].overall_rating;
            const displayMatchesPlayed = overallRatingArray[i].matches_played

            console.log('display name: ', displayName);
            console.log('display all time rating:', displayRating);
            str = str  + `
                            <tr>
                                <td>${displayName}</td>
                                <td>${displayRating}</td>
                                <td>${displayMatchesPlayed}</td>
                            </tr>
                         `
        }
        table.insertAdjacentHTML('beforeend', str);
    } else {
        alert('There was an error with the server!')
    }
}

