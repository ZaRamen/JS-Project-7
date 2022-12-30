var jsonFile;
var timeObject = null;
var timeLeft = 30;
var score = 0   ;
var pokemonQuizInfo = {};


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

    console.log(pokemonData);
   
    pokemonQuizInfo['name'] = name.charAt(0).toUpperCase() + name.slice(1);
    pokemonQuizInfo['spriteURL'] = pokemonData['sprites']['front_default']; 
    console.log(pokemonQuizInfo['name']);
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
    timeLeft--;
    if (timeLeft == 0)
    {
        alert("You ran out of time");
        nextPokemon();
    }
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
        console.log("wrong");
    }
    document.getElementById('guess').value = "";
}
function hint()
{
    
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

