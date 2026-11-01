"use strict";
// -Fetch DOM elements //

const contactForm = document.querySelector("#contact-form");

const clearButton = document.querySelector("#clear");
const submitButton = document.querySelector("#submit");

const errorList = document.querySelector("#errorlist");

const cards = document.querySelectorAll('.preview-card');

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

function createMessageObject(form) {
    // Reads input names and values
    const formData = new FormData(form);
    
    return {
        name: formData.get("name"),
        message: formData.get("message"),
        email: formData.get("email")
        };
}

/* Inactive local message storing function
function saveMessage(data) {
    // Get existing messages or initialize an empty array
    let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
    
    // Push the new message object
    messages.push(data);
    
    // Save back to localStorage
    localStorage.setItem("contactMessages", JSON.stringify(messages));
    console.log("Message stored locally. Total stored:", messages.length);
}
*/

async function sendViaEmailJS(data) {
    const serviceID = "service_bxyvghs";
    const templateID = "template_hft6aao";

    // Map your form data object to the template parameters
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message
    };

    try {
        const response = await emailjs.send(serviceID, templateID, templateParams);
        console.log("Email successfully sent!", response.status, response.text);
        return true; // success status
    } catch (error) {
        console.error("Email dispatch failed:", error);
        return false; // failure status
    }
}

// Listen for window scroll events to adjust header style
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // Exit early if the header element does not exist
    if (!header) {
        return;
    }
    
    // Trigger shrunk state when when scrolling past specific measure
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Event listeners for preview-card dropdown selection
// If-claused to not cause errors as this doesnt apply to every .html
if (cards) {
    // For each preview card dropdown button
    for (const card of cards) {
        const dropdownButton = card.querySelector('.dropdown-button');
        
        // Attach event listener
        dropdownButton.addEventListener('click', function() {
            // Store state-when-clicked
            const isAlreadyActive = card.classList.contains('active');
            
            // Fetch all cards and remove eventual active state
            const allCards = document.querySelectorAll('.preview-card');
            for (const otherCard of allCards) {
                otherCard.classList.remove('active');
            }
            
            // Unless the clicked card already was open, open it now
            if (!isAlreadyActive) {
                card.classList.add('active');
            }
        });
    }
}

// Event listeners for contact formula
// If-claused to not cause errors as this doesnt apply to every .html
if (clearButton) { 
    clearButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        // Modular targeting of form for reausability
        const targetForm = event.target.closest("form");
        
        if (targetForm) {
            clearForm(targetForm);
        }
    });
}
if (clearButton) {
    submitButton.addEventListener("click", async function(event) {
        event.preventDefault();
        
        // Modular targeting of form for reausability
        const targetForm = event.target.closest("form");
        
        // Validate input
        let validInput = validateForm(targetForm);

        if (validInput === true){
            if (targetForm) {

                console.log("message valid");
                
                // create message with correct structure
                const messageData = createMessageObject(targetForm);

                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
                
                // send to author via EmailJS api
                const isSent = await sendViaEmailJS(messageData);

                if (isSent) {
                    clearForm(targetForm);
                    submitButton.textContent = "Message sent!";
                    // Keeping button inactive to mitigate multiple messages for now..
                } else {
                    // show error to user
                    const errorList = targetForm.querySelector("#errorlist");
                    if (errorList) {
                        errorList.innerHTML = "<li>Failed to send message. Please try again later.</li>";
                    }
                }

                /* save message to localstorage
                this release sends message via EmailJS instead 
                saveMessage(messageData);            
                */ 
            }
        }
    });
}

