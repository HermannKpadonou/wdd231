const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');


async function getProphetData() {
  const response = await fetch(url); // request
  const data = await response.json(); // parse the JSON data
  //console.log(data.prophets); // temp output test of data response 
  displayProphets(data.prophets);
}



const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
    // card build code goes here
    let card = document.createElement("section");
    let fullName = document.createElement("h2");
    let portrait = document.createElement("img");
    let birthDate = document.createElement("p");
    let birthPlace = document.createElement("p");
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    portrait.setAttribute("src", prophet.imageurl);
    portrait.setAttribute("alt", `Portrait of ${prophet.name} ${prophet.lastname}`);

    

    portrait.setAttribute("loading", "lazy");
    portrait.setAttribute("width", "340");
    portrait.setAttribute("height", "440");

    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);
    cards.appendChild(card);
});
  
};

getProphetData();

