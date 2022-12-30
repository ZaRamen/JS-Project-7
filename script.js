var jsonFile;
var timeObject = null;
var timeLeft = 30;
var score = 0   ;
var pokemonQuizInfo = {};
var hintCounter = 0;
var currentHintName = "";

function logKey(event)
{
    //console.log(event.which);
    //enter key
    if (event.which == 13)
    {
        guessPokemon();
    }
     //key presses don't work when input field is focused
     if (document.getElementById('guess') != document.activeElement)
     {
        
        // '/' key
        if (event.which == 47)
        {
            hint();
        }
        // space key
        else if (event.which == 32)
        {
            nextPokemon(false);
        }
     }
   
}
async function fetchPokeAPI(url)
{
    const response =  await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
}
async function getPokemonInfo()
{
    let name;
    let pokemonData;
    //some pokemon have - in their name, don't include them in the pool
    do
    {
        //choose random pokemon
        let rand = Math.floor(Math.random() * jsonFile["results"].length);
        // console.log(jsonFile["results"][rand]);
        name = jsonFile["results"][rand]["name"];
        let url = jsonFile["results"][rand]["url"];
        pokemonData = await fetchPokeAPI(url);
    }
    while(name.includes("-"))

    // console.log(pokemonData);
   
    pokemonQuizInfo['name'] = name.charAt(0).toUpperCase() + name.slice(1);
    pokemonQuizInfo['spriteURL'] = pokemonData['sprites']['front_default']; 
    // console.log(pokemonQuizInfo['name']);
}


async function startGame()
{
    
    await getPokemonInfo();
    //start timer after image shows up
    startTimer();
    display();
}
function display()
{
    document.getElementById('pokemon-image').src = pokemonQuizInfo['spriteURL'];
}
function startTimer()
{
    document.getElementById("timer").innerHTML = "Time Remaining: " + timeLeft + " seconds";
    timeObject = setInterval(decrement, 1000);
}

function decrement()
{
    document.getElementById("timer").innerHTML = "Time Remaining: " + timeLeft + " seconds";
    if (timeLeft == 0)
    {
        
        setTimeout(function (){
            alert("You ran out of time");
        }, 200);

        setTimeout(function ()
        {
           nextPokemon(); 
        }, 250);
        
    }

    
    timeLeft--;
    
}

//button choices 
function guessPokemon()
{
    let message = document.getElementById('message');
    if (document.getElementById('guess').value.toLowerCase() == pokemonQuizInfo['name'].toLowerCase())
    {
        message.innerHTML = "Correct!";
        score++;
        document.getElementById('score').innerHTML = "Score: " + score;
        setTimeout(function()
        {
            nextPokemon(true);
        }, 200);   
    }
    else
    {
        message.innerHTML = "Incorrect!";
    }
    document.getElementById('guess').value = "";
}
function hint()
{
    let message = document.getElementById('message');
    switch(hintCounter)
    {
        case 0:
            message.innerHTML = "The Pokemon's name contains " + pokemonQuizInfo['name'].length + " characters";
            hintCounter++;
            break;
        case 1:
            message.innerHTML = "The Pokemon name starts with the letter " + pokemonQuizInfo['name'].charAt(0);
            //reset the hint counter
            hintCounter++;
            break;
        case 2:
            //should not give multiple hint name, one per pokemon
            if (currentHintName == "")
            {
                currentHintName = revealPartOfName(pokemonQuizInfo['name']);
            }
            message.innerHTML = "Hint is " + currentHintName.join(' ');
            hintCounter++;
            break;
        case 3:
            message.innerHTML = "The Pokemon's name contains " + pokemonQuizInfo['name'].length + " characters" + "<br>";
            message.innerHTML += "The Pokemon name starts with the letter " + pokemonQuizInfo['name'].charAt(0) + "<br>";
            message.innerHTML += "Hint is " + currentHintName.join(' ') + "<br>";
            
    }   
}
function revealPartOfName(name)
{
    let numbers = [];
    let tmp;
    let numberCounter = 0;
    let hintName = Array.apply(null, Array(name.length));
    hintName.fill("_");
    for (let i = 0; i < Math.floor(name.length / 2); i++)
    { 
        do
        {
            let rand = Math.floor(Math.random() * name.length);
            tmp = numbers.includes(rand);
            if (!tmp)
            {
                //numbers array contains the index of the letters that we want to display
                numbers.push(rand);
                //don't sort the array as that can cause issues
                //i.e let's say numbers[0] is [5], andn name[5] is 'l' so it  puts 'l' in hintName[5]
                //then numbers appends a 1. It sorts and then numbers is [1, 5]
                //but now numberCounter = 1
                //we put 'l' in numbers[1] = name[numbers[1]] (this is name[5])               
                hintName[rand] = name[numbers[numberCounter]];
                numberCounter++;
            }  
        }
        while(tmp)
    }
    return hintName;
    

}
function nextPokemon(guessRight)
{
    //clear timer
    clearInterval(timeObject);

    //show answer if they skipped the pokemon
    if (!guessRight)
    {
        alert("Correct Pokemon was " + pokemonQuizInfo['name']);
    }
    //reset time and message
    timeLeft = 30;
    message.innerHTML = "";  
    hintCounter = 0;
    currentHintName = "";
    //restart game
    startGame(); 
}

document.addEventListener('DOMContentLoaded',  async function()
{
    //get all the pokemon
    let url = "https://pokeapi.co/api/v2/pokemon/?limit=1154&";
    //contains all pokemon data
    jsonFile = await fetchPokeAPI(url)
    // console.log(jsonFile);

    startGame();
  
});

