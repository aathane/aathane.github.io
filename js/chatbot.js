// chat.js

// constants
const API_URL = "mistralai/Mistral-7B-Instruct-v0.3";

// get DOM elements
const chatToggleButton = document.getElementById("chat-toggle-button");
const chatPopup = document.getElementById("chat-popup");
const chatCloseButton = document.getElementById("chat-close-button");
const sendButton = document.getElementById("send-button");
const userInputField = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

// open pop-up
chatToggleButton.addEventListener("click", () => {
  chatPopup.style.display = "flex";
});

// close pop-up
chatCloseButton.addEventListener("click", () => {
  chatPopup.style.display = "none";
});

// send message to the API when user click "send"
sendButton.addEventListener("click", () => {
  // get user input
  const userInput = userInputField.value;
  
    // check if the user's input is not empty after trimming unnecessary spaces
    if (userInput.trim() !== "") {
      // add the user's message to the chat log with the label "You"
      addMessage("You", userInput);
      // call the function to send the user's message to the Hugging Face API and get a response
      callHuggingFace(userInput);
      
      // clear the input field after sending the message
      userInputField.value = "";
    }
});

// enter button
userInputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

// function to add a message to the chat log
function addMessage(sender, text) {
  // create a new div element for the message
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  // format the message with the sender's name and the text
  messageDiv.innerHTML = `<strong>${sender} :</strong> ${text}`;
  // append the message to the chat log
  chatLog.appendChild(messageDiv);
  // scroll to the bottom of the chat log to show the latest message
  chatLog.scrollTop = chatLog.scrollHeight;
}

// hf interface
import { InferenceClient } from "@huggingface/inference";


// Appel à l'API Hugging Face pour obtenir une réponse du chatbot
async function callHuggingFace(text) {
  try {
    // Préparer le client avec la clé API
    const client = new InferenceClient(API_TOKEN);

    // Appeler l'API avec le message de l'utilisateur
    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: API_URL,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 512,
    });

    // Extraire la réponse du chatbot
    const botReply = chatCompletion.choices[0]?.message?.content || "Désolé, je n'ai pas pu obtenir de réponse.";
    addMessage("Chatbot", botReply);
  } catch (error) {
    console.error("Erreur :", error);
    addMessage("Chatbot", "Erreur lors de la connexion au modèle.");
  }
}

