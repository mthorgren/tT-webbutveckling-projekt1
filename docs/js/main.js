"use strict";
// -Fetch DOM elements //

const contactForm = document.querySelector("#contact-form");

const clearButton = document.querySelector("#clear");
const submitButton = document.querySelector("#submit");


function clearForm(form) {
    
    form.reset();
    // Rensa eventuella felmeddelanden
    // errorList.innerHTML = "";
}



// Event listener
clearButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Modular targeting of form for reausability
    const targetForm = event.target.closest("form");
    
    if (targetForm) {
        clearForm(targetForm);
    }
});