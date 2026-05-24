const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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

    conversationHistory.push({ role: "user", content: userInput });

    // Check if user asked about the developer
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes("who is the developer") || lowerCaseInput.includes("developer,chatbot")) {
        displayBotResponse("Moshilning Koninga is the developer of this chatbot. He lives in the North East state of Manipur,India belongs to Maring tribe (Naga Community)");
        return;
    }

    showLoading();

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ model: "deepseek/deepseek-chat", messages: conversationHistory })
        });

        let data = await response.json();
        let botText = data.choices[0].message.content;

        hideLoading();
        displayBotResponse(botText);

        // Add to conversation history
        conversationHistory.push({ role: "assistant", content: botText });

    } catch (error) {
        hideLoading();
        displayBotResponse("Sorry, connection failed.");
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
