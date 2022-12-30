var jsonFile;
var count;
var score = 0   ;
var pokemonQuizInfo = {};


async function fetchPokeAPI(url)
{
    const response =  await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
}
function timer()
{

}


async function getPokemonInfo()
{
    let name;
    let pokemonData;
    do
    {
        let rand = Math.floor(Math.random() * jsonFile["results"].length);
        console.log(jsonFile["results"][rand]);
        name = jsonFile["results"][rand]["name"];
        let url = jsonFile["results"][rand]["url"];
        pokemonData = await fetchPokeAPI(url);
    }
    while(name.includes("-"))

    console.log(pokemonData)
    pokemonQuizInfo['name'] = name;
    pokemonQuizInfo['spriteURL'] = pokemonData['sprites']['front_default'];
}

async function startGame()
{
    await getPokemonInfo();
    display();
}

function display()
{
    document.getElementById('pokemon-image').src = pokemonQuizInfo['spriteURL'];
}
function guessPokemon()
{
    if (document.getElementById('guess').value.toLowerCase() == pokemonQuizInfo['name'].toLowerCase())
    {
        console.log("right");
        score++;
        document.getElementById('score').innerHTML = "Score: " + score;
        nextPokemon();
    }
    else
    {
        console.log("wrong");
    }
    document.getElementById('guess').value = "";
}
function nextPokemon()
{
    startGame();
}

document.addEventListener('DOMContentLoaded',  async function()
{
    //get all the pokemon
    let url = "https://pokeapi.co/api/v2/pokemon/?limit=1154&";
    jsonFile = await fetchPokeAPI(url)
    console.log(jsonFile);

    //choose a random pokemon
    startGame();
});

