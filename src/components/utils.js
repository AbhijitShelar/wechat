export const appendMessage = (message, position) => {
    const chatContainer = document.querySelector(".chat-area");
    const messageElement = document.createElement("div");
    messageElement.textContent = message; // Use textContent to set the text
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    chatContainer.append(messageElement);
  };