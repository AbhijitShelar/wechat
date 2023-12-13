export const appendMessage = (message, position) => {
  const chatContainer = document.querySelector(".chat-area");
  const messageElement = document.createElement("div");
  const timestampElement = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageElement.textContent = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);

  timestampElement.textContent = timestamp;
  timestampElement.classList.add("timestamp");

  // Nest the timestamp element inside the message element
  messageElement.appendChild(timestampElement);

  // Append the entire message element to the chat container
  chatContainer.append(messageElement);
};
