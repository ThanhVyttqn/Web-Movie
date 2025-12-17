import { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    const chatIframe = document.getElementById("chat-iframe");
    const chatButton = document.getElementById("chat-button");
    const chatContainer = document.getElementById("chat-container");
    const chatClose = document.getElementById("chat-close");

    if (chatButton && chatContainer && chatClose) {
      chatButton.onclick = () => {
        chatContainer.style.display = "flex";
      };
      chatClose.onclick = () => {
        chatContainer.style.display = "none";
      };
    }
  }, []);

  return (
    <>
      <div id="chat-button">
        💬
      </div>
      <div id="chat-container">
        <div id="chat-header">
          Chat với chúng tôi
          <span id="chat-close">✕</span>
        </div>
        <iframe
          id="chat-iframe"
          src="https://cdn.botpress.cloud/webchat/v2.4/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/19/03/20250419030426-HHX5XW7Y.json"
          title="Bot Chat"
          allow="microphone;"
        />
      </div>

      <style>{`
        #chat-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #0084ff;
          color: white;
          border-radius: 50%;
          padding: 15px;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        #chat-container {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 350px;
          height: 500px;
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          display: none;
          flex-direction: column;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        #chat-header {
          background-color: #0084ff;
          color: white;
          padding: 10px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #chat-close {
          cursor: pointer;
        }

        #chat-iframe {
          flex: 1;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
