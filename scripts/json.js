const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');


async function getData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/'); // request
  const data = await response.json(); // parse the JSON data
  //console.log(data.prophets); // temp output test of data response 
  displayPrpophets(data.prophets);
}

getData();

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
    // card build code goes here
    let card = document.createElement("section");
    let fullName = document.createElement("___");
    let portrait = document.createElement("img");

    fullName.textContent = `${prophet._____} ______________`;
    portrait.setAttribute("src", prophet.imageurl);
    portrait.setAttribute("alt", `Portrait of ${prophet._____} ______________`);
    portrait.setAttribute("loading", "lazy");
    portrait.setAttribute("width", "340");
    portrait.setAttribute("height", "440");

    card.appendChild(_____);
    card.appendChild(portrait);
    cards.appendChild(card);
});
  
}

