// Store the selected elements that we are going to use.

const navButton = document.querySelector("#ham-btn");
const navBar = document.querySelector('#nav-bar');


// Toggle the show class off and on.
navButton.addEventListener('click', () => {
  navButton.classList.toggle('show'); 
  navBar.classList.toggle('show');  
});


document.addEventListener("DOMContentLoaded", function() {
    
    const currentYear = document.querySelector("#currentYear");
    const today = new Date();
    currentYear.innerHTML = today.getFullYear();
  
    
    let modified = document.querySelector("#lastModified");
    modified.innerHTML = new Date(document.lastModified).toLocaleString();
  });