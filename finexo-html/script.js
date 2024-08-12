

import API_KEY from "./apikey.js";
const userInput = document.querySelector("#user-input");
const sendButton = document.querySelector("#send-button");
const chatbox = document.querySelector(".chat-body");


const adjustTextAreaHeight = () => {
    userInput.style.height = 'auto'; 
    userInput.style.height = `${userInput.scrollHeight}px`; 
};

const createChatDiv = (message, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("message", className);
    chatDiv.innerHTML = `<p>${message}</p>`;
    return chatDiv;
};
// Function to format markdown-like text
const formatText = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // Bold
        .replace(/_(.*?)_/g, "<em>$1</em>")               // Italic
        .replace(/\n/g, "<br>");                          // New lines
};


const generateResponse = async (incomingChat,userMessage) => {
   
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const messageElement = incomingChat.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [{
                "role": "user",
                "parts": [{ "text": userMessage }]
            }]
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        console.log("API Response:", data); // Log response for debugging
        
        
        const botResponse = data.candidates[0]?.content?.parts[0]?.text || "No response";
        const formattedResponse = formatText(botResponse);

        messageElement.innerHTML = formattedResponse;
    } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }

};

const displayChat = () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatDiv(userMessage, "user-message"));
    userInput.value = "";  
    adjustTextAreaHeight(); 
    chatbox.scrollTo(0, chatbox.scrollHeight);  

    setTimeout(() => {
        const incomingChat=createChatDiv("Thinking....", "bot-message")
        chatbox.appendChild(incomingChat);
        chatbox.scrollTo(0, chatbox.scrollHeight);  
        generateResponse(incomingChat,userMessage);
    }, 600);
};

userInput.addEventListener("input", adjustTextAreaHeight);
sendButton.addEventListener("click", displayChat);