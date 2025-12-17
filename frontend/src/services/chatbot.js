const chatButton = document.getElementById("chat-button");
const chatContainer = document.getElementById("chat-container");
const chatClose = document.getElementById("chat-close");

// Mở chat
chatButton.addEventListener("click", () => {
    chatContainer.style.display = "flex";
    chatButton.style.display = "none";
});

// Đóng chat
chatClose.addEventListener("click", () => {
    chatContainer.style.display = "none";
    chatButton.style.display = "block";
});