const container = document.querySelector(".container");
const chatInput = container.querySelector(".chatbot__input-textarea");
const sendChatBtn = container.querySelector(".chatbot__input-btn");
const chatbox = container.querySelector(".chatbox");
const chatbotToggler = container.querySelector(".chatbot-toggle");
const chatbotCloseBtn = container.querySelector(".chatbot__mobile-close-btn");

let userMessage = null;
const API_KEY = "MY_API_KEY";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chatbox__msg", `${className}`);

  let chatContent =
    className === "chatbox__msg_outgoing"
      ? `<p class="chatbox__msg-text"></p>`
      : `<span class="chatbox__msg-icon material-symbols-outlined">smart_toy</span>
         <p class="chatbox__msg-text"></p>`;

  // Prevents the use of html tags in the input
  chatLi.innerHTML = chatContent;
  chatLi.querySelector(".chatbox__msg-text").textContent = message;
  return chatLi; // return chat <li> element
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector(".chatbox__msg-text");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // Send POST request to API and get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
      console.log(error);
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "chatbox__msg_outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking.." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking..", "chatbox__msg_incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendChatBtn.onclick = () => handleChat();
chatbotToggler.onclick = () => container.classList.toggle("show-chatbot");
chatbotCloseBtn.onclick = () => container.classList.remove("show-chatbot");

// Enter and Shift+Enter keys combination
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
    event.preventDefault();
    handleChat();
  }
});