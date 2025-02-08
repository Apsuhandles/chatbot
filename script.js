// Send message to the bot
function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();
    
    if (message === "") return;

    displayMessage(message, "user");

    // Call the backend API and send the user's message
    fetch("https://apsubackend.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        // Process and display the bot's response
        const botResponse = processBotResponse(data.response);
        displayMessage(botResponse, "bot");
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage("Sorry, something went wrong.", "bot");
    });

    // Clear the input field
    userInput.value = "";
}

// Process the bot's response to support formatting
function processBotResponse(response) {
    // Support bold text (**text** → <strong>text</strong>)
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert newlines to <br> tags for proper multiline display
    response = response.replace(/\n/g, "<br>");

    // Convert markdown-style lists to proper HTML lists
    response = response.replace(/(^|\n)-\s(.*?)(?=\n|$)/g, '<li>$2</li>');

    // If list items exist, wrap them in <ul>
    if (response.includes("<li>")) {
        response = "<ul>" + response + "</ul>";
    }

    return response;
}

// Display messages in the chatbox
function displayMessage(text, sender) {
    const chatbox = document.getElementById("chatbox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    if (sender === "bot") {
        messageDiv.innerHTML = text; // Parse HTML content for bot messages
    } else {
        messageDiv.textContent = text; // Keep user messages as plain text
    }

    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
}

// Send message when Enter key is pressed
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
