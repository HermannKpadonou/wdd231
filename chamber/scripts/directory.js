const url = 'data/members.json';
const cards = document.querySelector('#cards');


async function getMembersData() {
  const response = await fetch(url); // request
  const data = await response.json(); // parse the JSON data
  //console.log(data.prophets); // temp output test of data response 
  displayMembers(data.members);
}

/**
 * Creates and displays a card for each member.
 * @param {Array} members - An array of member objects from the JSON file.
 */
const displayMembers = (members) => {
    members.forEach((member) => {
    // 1. Create all necessary HTML elements
    let card = document.createElement("section");
    let name = document.createElement("h2");
    let image = document.createElement("img");
    let address = document.createElement("p");
    let phone = document.createElement("p");
    let website = document.createElement("a");
    let membership = document.createElement("p");

    // 2. Populate elements with member data
    name.textContent = member.name;
    address.textContent = `Address: ${member.address}`;
    phone.textContent = `Phone: ${member.phone}`;
    
    website.textContent = `${member.website}`;
    website.href = member.website;
    website.target = "_blank"; // Open link in a new tab

    // 3. Handle the membership level logic
    let membershipText;
    if (member.membershipLevel === 3) {
      membershipText = "🥇🥇🥇";
      card.classList.add("gold-member");
    } else if (member.membershipLevel === 2) {
      membershipText = "🥈🥈";
      card.classList.add("silver-member");
    } else {
      membershipText = "🥉";
      card.classList.add("standard-member");
    }
    membership.textContent = `Membership Level : ${membershipText}`;

    // 4. Set attributes and styles for the image
    // Note: Assuming images are in an "images" folder
    image.setAttribute("src", `images/${member.image}`); 
    image.setAttribute("alt", `Logo for ${member.name}`);
    image.setAttribute("loading", "lazy");
    image.setAttribute("width", "200");
    image.setAttribute("height", "150");

    

    // 5. Append all elements to the card, then the card to the container
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);
    card.appendChild(membership);


    cards.appendChild(card);
  });
};

// Start the entire process
getMembersData();

const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("article");

// The following code could be written cleaner. How? We may have to simplfiy our HTMl and think about a default view.

gridbutton.addEventListener("click", () => {
	// example using arrow function
	display.classList.add("grid");
	display.classList.remove("list");
});

listbutton.addEventListener("click", showList); // example using defined function

function showList() {
	display.classList.add("list");
	display.classList.remove("grid");
}




