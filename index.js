const textInput = document.getElementById("textInput");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const micBtn = document.getElementById("micBtn");
const chatBox = document.getElementById("chatBox");
const status = document.getElementById("status");
const chatHint = document.getElementById("chatHint");

function checkChatHint() {
  if (chatBox.children.length > 1) { // more than hint p
    chatHint.style.display = "none";
  } else {
    chatHint.style.display = "block";
  }
}

// Function to add message bubbles
function addBubble(text, type = "user") {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", type);
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Text to Speech
speakBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (!text) return;
  addBubble(text, "user");

  const utter = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utter.voice = voices.find(v => v.lang.includes("en")) || voices[0];
  speechSynthesis.speak(utter);

  utter.onend = () => {
    addBubble("✔️ Spoken out loud", "ai");
  };
});

// Clear text and chat
clearBtn.addEventListener("click", () => {
  textInput.value = "";
  chatBox.innerHTML = "";
  status.textContent = "Click mic to start speaking...";
});

// Speech to Text setup
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    status.textContent = "🎧 Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textInput.value = transcript;
    addBubble(transcript, "user");
  };

  recognition.onerror = (e) => {
    status.textContent = "⚠️ " + e.error;
  };

  recognition.onend = () => {
    status.textContent = "Mic off. Click again to speak.";
  };
} else {
  alert("Speech recognition not supported. Try using Chrome.");
}

// Start listening on mic click
micBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
});
