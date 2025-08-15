document.addEventListener("DOMContentLoaded", function() {
    
    const currentYear = document.querySelector("#currentYear");
    const today = new Date();
    currentYear.innerHTML = today.getFullYear();
  
    
    let modified = document.querySelector("#lastModified");
    modified.innerHTML = new Date(document.lastModified).toLocaleString();
  });
