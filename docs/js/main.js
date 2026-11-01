"use strict";
// -Fetch DOM elements //

const contactForm = document.querySelector("#contact-form");

const clearButton = document.querySelector("#clear");
const submitButton = document.querySelector("#submit");

const errorList = document.querySelector("#errorlist");

// Base variables

let errors = [];

function displayErrors() {
    // Clear older errors
    errorList.innerHTML = "";
    // Write current error message to DOM
    for (let error of errors) {
        let errorListObject = document.createElement("li");
        let errorText = document.createTextNode(error);
        errorListObject.appendChild(errorText);

        errorList.appendChild(errorListObject);
    }
};

function clearForm(form) {
    
    form.reset();
    errorList.innerHTML = "";
    errors = [];
}

function validateForm(form) {
    const nameInput = form.querySelector("#name");
    const messageInput = form.querySelector("#message");
    const emailInput = form.querySelector("#email");
    
    let isValid = true;
    errors = [];

    // Validate name text input
    if (nameInput.value.trim() === "") {
        errors.push("Name must be specified");
        isValid = false;
    }

    // Validate message text input
    if (messageInput.value.trim() === "") {
        errors.push("Message must be specified");
        isValid = false;
    }

    // Validate email with regex for "@" and "."
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValue === "") {
        errors.push("A valid email-address must be specified");
        isValid = false;
    } else if (!emailPattern.test(emailValue)) {
        errors.push("Invalid email format.");
        isValid = false;
    }

    // If validation fails; display errors. 
    if (!isValid) {
        displayErrors();
    }else {
        errorList.innerHTML = ""; // Clear errors if validation passes
    }

    return isValid;
}

// Event listeners
clearButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Modular targeting of form for reausability
    const targetForm = event.target.closest("form");
    
    if (targetForm) {
        clearForm(targetForm);
    }
});

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Modular targeting of form for reausability
    const targetForm = event.target.closest("form");
    
    // Validate input
    let validInput = validateForm(targetForm);
    if (validInput === true ){

        console.log("message valid");
        
        // create message with correct structure

        // send message to author

        if (targetForm) {
            clearForm(targetForm);
        }
    }
});