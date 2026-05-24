// Paste your Google AI Studio API key here (Starts with AIza...)
const API_KEY = "AIzaSyAYFNCA0eN8-G5EKPm-jOu2bClVSLBRSMQ";

// FIXED: Native Google endpoint allows CORS requests straight from the browser
const API_URL = `https://googleapis.com{API_KEY}`;

let conversationHistory = [];
let hasGreeted = false; 

// Toggle Chatbot
document.getElementById("chatbot-toggle").addEventListener("click", function () {
    document.getElementById("chat-container").style.display = "flex";
    
    if (!hasGreeted) {
        displayGreeting();
        hasGreeted = true;
    }
});

document.getElementById("close-chat").addEventListener("click", function () {
    document.getElementById("chat-container").style.display = "none";
});

// Sending Message
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});

// Display Greeting with Typing Animation
function displayGreeting() {
    let chatBox = document.getElementById("chat-box");

    let typingMessage = document.createElement("div");
    typingMessage.classList.add("message", "bot");
    typingMessage.innerHTML = "<b>Komo Chatbot:</b> ";
    chatBox.appendChild(typingMessage);

    let text = "Hello, I'm Komo Chatbot. How can I assist you today 🥱";
    let i = 0;

    function type() {
        if (i < text.length) {
            typingMessage.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50); 
        }
    }

    setTimeout(type, 500); 
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Show and hide loading animation
function showLoading() {
    let chatBox = document.getElementById("chat-box");
    let loadingMessage = document.createElement("div");
    loadingMessage.classList.add("message", "bot");
    loadingMessage.id = "loading-message";
    loadingMessage.innerHTML = "<b>Komo's Assistant:</b> <span class='loading-dots'>...</span>";
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Hide loading animation
function hideLoading() {
    let loading = document.getElementById("loading-message");
    if (loading) loading.remove();
}

// Sending and Displaying Bot Response with Typing Animation
async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="message user"><b>You:</b> ${userInput}</div>`;
    document.getElementById("user-input").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // FIXED: Format updated to match Google's native 'parts' structure
    conversationHistory.push({ role: "user", parts: [{ text: userInput }] });

    // Check if user asked about the developer
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes("who is the developer") || lowerCaseInput.includes("developer,chatbot")) {
        let localResponse = "Moshilning Koninga is the developer of this chatbot. He lives in the North East state of Manipur,India belongs to Maring tribe (Naga Community)";
        displayBotResponse(localResponse);
        // Save local response to history using Google's role syntax
        conversationHistory.push({ role: "model", parts: [{ text: localResponse }] });
        return;
    }

    showLoading();

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // FIXED: Google's native API takes 'contents' instead of 'messages'
            body: JSON.stringify({ contents: conversationHistory })
        });

        let data = await response.json();
        
        // FIXED: Safely parsing the text response from Google's response payload
        let botText = data.candidates[0].content.parts[0].text;

        hideLoading();
        displayBotResponse(botText);

        // FIXED: Google uses the role name 'model' instead of 'assistant'
        conversationHistory.push({ role: "model", parts: [{ text: botText }] });

    } catch (error) {
        hideLoading();
        displayBotResponse("Sorry, connection failed.");
        console.error(error);
    }
}

// Function to display bot response with typing animation and auto-scroll
function displayBotResponse(botText) {
    let chatBox = document.getElementById("chat-box");

    let botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot");
    botMessage.innerHTML = "<b>Komo's Assistant:</b> ";
    chatBox.appendChild(botMessage);

    let i = 0;
    function type() {
        if (i < botText.length) {
            botMessage.innerHTML += botText.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scrolls as the bot types
            setTimeout(type, 50); // Adjust typing speed
        }
    }

    setTimeout(type, 500); // Delay before typing starts
}
